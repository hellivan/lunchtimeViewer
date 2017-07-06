import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class PartnerService {

	constructor(
		private http: Http
	) {}

	public importPartners(): Observable<any> {
		return this.http.get('api/partners/import')
			.map((res: Response) => res.json());
	}
	
	public getPartners(): Observable<any> {
		return this.http.get('api/partners')
			.map((res: Response) => res.json());
	}
}
