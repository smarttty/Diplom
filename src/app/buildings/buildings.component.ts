import { Component, OnInit } from '@angular/core';
import {InputFileModule} from "ngx-input-file";
import {Building} from "../model/building";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";
import {Router} from "@angular/router";

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.css']
})
export class BuildingsComponent implements OnInit {

  addNew : boolean = false;
  model = new Building();
  settings = {
    columns: {
      name: {
        title: 'Название'
      },
      floors: {
        title: 'Кол-во этажей'
      },

    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
    }

  };
  public error : string=null;
  private data : any;
  public source = new LocalDataSource();
  constructor(private dt : DataproviderService, private router : Router) { }
  ngOnInit() {
    this.dt.getAllBuildings().then(buildings =>{
      this.data = buildings;
      this.source.load(this.data);
    });
  }
  addNewClick(){
    this.addNew = true;
  }
  notAddNewClick(){
    this.addNew = false;
  }
  submitBuilding(){

    this.dt.addBuilding(this.model).then(res=>{
      if(res[0] && res[1].indexOf("Ошибка")==-1){
        this.model.name='';
        this.addNew = false;
      }
      else if(res[1].indexOf("Ошибка")!==-1){
        this.error = res[1];
      }
      this.refreshBuildings();
    });

  }
  refreshBuildings(){
    this.dt.getAllBuildings().then(buildings =>{
      this.data = buildings;
      this.source.load(this.data);
    });
  }
  onBuildingSelect($event){
    if($event.isSelected) {
      this.router.navigate(['building/' + $event.data.id]);
    }
  }

}
