const request = require('request-promise');
const setCookie = require('set-cookie-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');

mongoose.Promise = Promise;

function requestData(cookie) {
	const formData = {
		ricerca: 'ok',
		descrizione: '',
		comune:	'BRUNICO',
		indirizzo: '',
		frazione: '#',
		libera:	''
	};
	
	const options = {
		method: 'POST',
		uri: 'http://lunchtime.lunchtronic.com/clienti/mappa_result2.jsp',
		form: formData,
		headers: {
			Cookie: `${cookie.name}=${cookie.value}`
		}	
	}
	
	return request(options);
}

function requestCookie() {
	const options = {
		uri: 'http://lunchtime.lunchtronic.com/clienti/MAPPA800748.jsp',
		resolveWithFullResponse: true
	}

	return request(options)
		.then(data => _.get(data, 'headers.set-cookie'))
		.then(v => setCookie.parse(v)[0]);

}

function parsePartners(data) {

	const rawMatches = [];
	const regex = new RegExp('javascript:top.main.showAddress\\((.*?)\\);', 'g');
	let matches = regex.exec(data);
	while(matches !== null) {
		if(matches.length > 1) {
			rawMatches.push(matches[1]);
		}
		matches = regex.exec(data);
	}

	return rawMatches.map(data => {
		const asJson = data.replace(new RegExp(`'`, 'g'), `"`);
		const parametersArray = `[${asJson}]`;
		const json = JSON.parse(parametersArray);
		return {
			address: json[0],
			name: json[1],
			phone: json[2],
			restDay: json[3],
			kind: json[4],
			other: json.slice(5)
		};
	});
}

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';

mongoose.connect(`mongodb://${MONGO_HOST}/lunchtime`);


const PARTNER_SCHEMA = new (mongoose.Schema)({
	address: String,
	name: String,
	phone: String,
	restDay: String,
	kind: String,
	other: []
});

const Partner = mongoose.model('partner', PARTNER_SCHEMA);

function importPartners() {
	return requestCookie()
		.then(cookie => requestData(cookie))
		.then(data => parsePartners(data))
		.then(partners => {
			return Promise.resolve()
				.then(() => Partner.remove({}))
				.then(() => Promise.all(partners.map(p => Partner.create(p))))
				.then(() => Partner.find());
		});
}



const app = express();

app.get('/api/partners/import', (req, res) => {
	importPartners()
		.then(partners => res.json(partners))
		.catch(err => res.status(500).send(err));
});

app.get('/api/partners', (req, res) => {
	Partner.find()
		.then(partners => res.json(partners))
		.catch(err => res.status(500).send(err));
});


app.use(express.static(`${__dirname}/../client/dist`));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
