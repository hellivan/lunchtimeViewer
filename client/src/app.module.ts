import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule, Http} from '@angular/http';

import {PartnerService} from './partner.service';
import {AppComponent} from './app.component';

import './app.component.scss';


@NgModule({
    imports: [
		BrowserModule,
		CommonModule,
		HttpModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [PartnerService]
})
export class AppModule {}
