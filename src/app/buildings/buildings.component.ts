import { Component, OnInit } from '@angular/core';
import {InputFileModule} from "ngx-input-file";
import {Building} from "../model/building";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";
import {LeafletModule, LeafletDirective} from "@asymmetrik/ngx-leaflet";
import {Router} from "@angular/router";
import {latLng, tileLayer} from "leaflet";
import {isUndefined} from "util";

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.css'],
})
export class BuildingsComponent implements OnInit {

  addNew: boolean = false;
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
    },
    rowClassFunction: (row) => {
      if (row.data.selected === true) {
        return 'green';
      } else {
        return '';
      }
    }

  };
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
    ],
    zoom: 17,
    center: latLng(58.008222, 56.187110)
  };
  drawOptions = {
    position: 'topright',
    draw: {
      polygon: true,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: false,
    }
  };
  public error: string = null;
  public data: any;
  public source = new LocalDataSource();

  constructor(private dt: DataproviderService, private router: Router) {
  }

  ngOnInit() {
    this.dt.getAllBuildings().then(buildings => {
      buildings.forEach(function(item){
        item.deleted = false;
        item.selected=false;
      });
      this.data = buildings;
      this.source.load(this.data);
    });
  }

  addNewClick() {
    this.addNew = true;
  }

  notAddNewClick() {
    this.addNew = false;
  }

  submitBuilding() {
    if(this.validate()) {
      this.dt.addBuilding(this.model).then(res => {
        if (res[0] && res[1].indexOf("Ошибка") == -1) {
          this.model.name = '';
          this.addNew = false;
        }
        else if (res[1].indexOf("Ошибка") !== -1) {
          this.error = res[1];
        }
        this.refreshBuildings();
      });
    }
    else{
      alert('Заполните все поля');
    }

  }

  refreshBuildings() {
    this.dt.getAllBuildings().then(buildings => {
      buildings.forEach(function(item){
        item.deleted = false;
        item.selected=false;
      });
      this.data = buildings;
      this.source.load(this.data);
    });
  }

  onBuildingSelect($event) {
    if($event.data.selected) {
      this.router.navigate(['building/' + $event.data.id]);
    }
    else{
      this.data.forEach(function(item){
        item.selected= false;
      });
      $event.data.selected=true;
    }
  }
  removeBuilding($event){
    var target = $event.target || $event.srcElement || $event.currentTarget;
    var idAttr = target.attributes.id;
    var buildId = parseInt(idAttr.nodeValue.substr(2));
    this.dt.delBuilding(buildId).then(res=>{
      this.data.forEach(function(item){
        if(item.id==buildId){
          item.deleted = true;
        }
      });
      confirm("Здание удалено");
      this.refreshBuildings();
    })
  }
  validate(){
    if(isUndefined(this.model.name)){
      return false
    }
    return true;
  }
}
