import { Component, OnInit } from '@angular/core';
import {Floor} from "../model/floor";
import {Router, ActivatedRoute} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  inputFileModel = [];
  addNew = false;
  model = new Floor();
  constructor(private dt:DataproviderService, private router : Router, private route : ActivatedRoute) {
    this.model.BuildingID = this.route.snapshot.params["id"];
  }

  ngOnInit() {
  }
  addNewClick(){
    this.addNew = true;
  }
  notAddNewClick(){
    this.addNew = false;
  }
  submitFloor(){
    console.log(this.model);
    console.log(this.inputFileModel);


  }

}
