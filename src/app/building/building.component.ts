import { Component, OnInit } from '@angular/core';
import {Floor} from "../model/floor";
import {Router, ActivatedRoute} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  inputFileModel = [];
  addNew = false;
  model = new Floor();
  public error : string=null;
  public data : any;
  public source = new LocalDataSource();
  public deleted : boolean = false;
  constructor(private dt:DataproviderService, private router : Router, private route : ActivatedRoute) {
    this.model.BuildingID = this.route.snapshot.params["id"];

  }
  perPage: number = 20;
  public settings = {
    columns: {
      level:{
        title: 'Уровень'
      },
      name: {
        title: 'Название'
      },
      h_url: {
        title: 'Карта'
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: this.perPage,
    }

  };

  ngOnInit() {
    this.refreshFloors();
  }
  addNewClick(){
    this.addNew = true;
  }
  notAddNewClick(){
    this.addNew = false;
  }
  submitFloor(){
    this.addNew=false;
    this.model.Image = this.inputFileModel[0].icon;
    this.dt.addFloor(this.model).then(ok=>{
      console.log(ok);
      this.refreshFloors();
    })
  }
  deleteFloor($event) {
    var target = $event.target || $event.srcElement || $event.currentTarget;
    var idAttr = target.attributes.id;
    var id = parseInt(idAttr.nodeValue.substr(2));
    var p_url = this.data.find(function(item){
      if(item.id==id){
        return true;
      }
      else{
        return false;
      }
    }).p_url;
    this.dt.delFloor(id, p_url).then(res=>{
      this.data.forEach(function(item){
        if(item.id==id){
          item.deleted = true;
        }
      });
      confirm("Этаж удалён");
    })

  }
  refreshFloors(){
    this.dt.getFloors(this.model.BuildingID).then(floors =>{
      floors.forEach(function(item){
        item.deleted=false;
      });
      this.data = floors.sort((obj1,obj2)=> obj1.level-obj2.level);
      this.source.load(this.data);
    });
  }

}
