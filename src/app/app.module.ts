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
import {DropdownModule} from "ng2-dropdown";

const appRoutes: Routes = [
  { path: 'apstat', component: ApstatComponent },
  {path: '', pathMatch:'full', redirectTo: 'apstat' },
  { path: 'apinfo/:name', component: ApinfoComponent },
  {path: 'clients', component: ClientstatComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    ApstatComponent,
    NavbarComponent,
    ApinfoComponent,
    ClientstatComponent,
    ClientinfoComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule, HttpModule,AngularMultiSelectModule,
    Ng2SmartTableModule,RouterModule.forRoot(
      appRoutes
    ), FormsModule
  ],
  providers: [DataproviderService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
