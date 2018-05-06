import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ApstatComponent } from './apstat/apstat.component';
import {HttpModule, RequestOptions} from '@angular/http';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { ApinfoComponent } from './apinfo/apinfo.component';
import {DataproviderService} from "./providers/dataprovider.service";
import { ClientstatComponent } from './clientstat/clientstat.component';
import { ClientinfoComponent } from './clientinfo/clientinfo.component';
import { SearchComponent } from './search/search.component';
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import {FormsModule} from "@angular/forms";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import {AuthService} from './providers/auth.service';
import { UserLoginComponent } from './user-login/user-login.component';
import {MessagingService} from "./providers/messaging.service";
import {AngularFireDatabase} from 'angularfire2/database';
import { BuildingsComponent } from './buildings/buildings.component';
import { BuildingComponent } from './building/building.component';
import { InputFileModule } from 'ngx-input-file';
import {NgProgressModule} from "@ngx-progressbar/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";
import { FloorComponent } from './floor/floor.component';

const appRoutes: Routes = [
  { path: 'apstat', component: ApstatComponent, canActivate:[AuthService] },
  {path: '', pathMatch:'full', redirectTo: 'apstat',   },
  { path: 'apinfo/:name', component: ApinfoComponent,canActivate:[AuthService] },
  { path: 'clientinfo/:mac', component: ClientinfoComponent,canActivate:[AuthService] },
  {path: 'clients', component: ClientstatComponent,canActivate:[AuthService] },
  {path: 'login', component: UserLoginComponent},
  {path: 'buildings', component: BuildingsComponent, canActivate:[AuthService]},
  {path: 'building/:id', component: BuildingComponent, canActivate:[AuthService]},
  {path: 'search?query=:query', component: SearchComponent, canActivate:[AuthService]},
  {path: 'floor/:id', component: FloorComponent, canActivate:[AuthService]}
];
export const firebaseconfig = {
  apiKey: "AIzaSyCAcmKVrI9A9-83FbkDuXATEUnnRbszIf0",
  authDomain: "pgniu-controller.firebaseapp.com",
  databaseURL: "https://pgniu-controller.firebaseio.com",
  projectId: "pgniu-controller",
  storageBucket: "pgniu-controller.appspot.com",
  messagingSenderId: "684972469158"
};

@NgModule({
  declarations: [
    AppComponent,
    ApstatComponent,
    NavbarComponent,
    ApinfoComponent,
    ClientstatComponent,
    ClientinfoComponent,
    SearchComponent,
    UserLoginComponent,
    BuildingsComponent,
    BuildingComponent,
    FloorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularMultiSelectModule,
    Ng2SmartTableModule,
    RouterModule.forRoot(
      appRoutes
    ),
    FormsModule,
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireAuthModule,
    InputFileModule,
    NgProgressModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()
  ],
  providers: [DataproviderService,AuthService,MessagingService,AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
