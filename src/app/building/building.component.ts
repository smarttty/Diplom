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
  private data : any;
  public source = new LocalDataSource();
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
    this.dt.getFloors(this.model.BuildingID).then(floors =>{
      console.log(floors);
      this.data = floors;
      this.source.load(this.data);
    });
  }
  addNewClick(){
    this.addNew = true;
  }
  notAddNewClick(){
    this.addNew = false;
  }
  submitFloor(){
    this.model.Image = this.inputFileModel[0].icon;
    this.dt.addFloor(this.model).then(ok=>{
      console.log(ok);
    })


  }

}
