import {Component, OnInit} from '@angular/core';
import {PartnerService} from './partner.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-component',
    template: require('./app.component.html'),
})
export class AppComponent implements OnInit {

	public partners$: Observable<any>;
	
    constructor(
		private partnerService: PartnerService
	) {}


    public ngOnInit(): void {
		this.partners$ = this.partnerService.getPartners();
    }

    public importPartners(){
		this.partnerService.importPartners()
			.subscribe(() => {
				console.log('Called import partners on server!');
			});
    }
}
