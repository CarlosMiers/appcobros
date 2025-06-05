import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddTtokenInterceptor } from './utils/add-ttoken.interceptor';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { SMS } from "@awesome-cordova-plugins/sms/ngx";
import es from '@angular/common/locales/es';
import { PipesModule } from './pipes/filtro/pipes.module';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';

registerLocaleData(es);


@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule,PipesModule,IonicModule.forRoot(), IonicStorageModule.forRoot(),
  HttpClientModule, FormsModule,  AppRoutingModule,],
  providers: [Toast,CurrencyPipe,  NativeGeocoder,Geolocation, SMS, {provide: HTTP_INTERCEPTORS,useClass: AddTtokenInterceptor, multi:true,},
    {provide: LOCALE_ID, useValue:'es-PY'},    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
