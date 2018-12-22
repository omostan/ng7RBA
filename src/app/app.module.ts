import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider, FakeBackendInterceptor } from "./_helpers";

import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertComponent } from './_directives';
import { RestangularModule } from "ngx-restangular";
import { Config } from './config';

//#region RestangularConfigFactory 

/**
 *
 * @param RestangularProvider is used to configure the base URL for the REST-API service
 */
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl(Config.apiUrl);
  RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer V6vzEfEimH2PoiretEB7o0jBhp5ICk#d'});
}

//#endregion RestangularConfigFactory

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    // importing RestangularModule and making default configs for restangular
    RestangularModule.forRoot(RestangularConfigFactory)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
