import {Component, OnInit} from '@angular/core';
import {Floor} from "../model/floor";
import {Router, ActivatedRoute} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";
import {isUndefined} from "util";
import {CRS, imageOverlay, latLng, latLngBounds, tileLayer, Map} from "leaflet";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  inputFileModel = [];
  addNew = false;
  model = new Floor();
  public error: string = null;
  public data: any;
  public source = new LocalDataSource();
  public deleted: boolean = false;
  public bounds_options=[];
  constructor(private dt: DataproviderService, private router: Router, private route: ActivatedRoute) {
    this.model.BuildingID = this.route.snapshot.params["id"];

  }
  perPage: number = 20;
  public settings = {
    columns: {
      level: {
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
  public imgPrefix = "http://212.192.88.199";

  ngOnInit() {
    this.refreshFloors();
  }

  addNewClick() {
    this.addNew = true;
  }

  notAddNewClick() {
    this.addNew = false;
  }

  submitFloor() {
    if (this.validate()) {
      this.addNew = false;
      this.model.Image = this.inputFileModel[0].icon;
      this.dt.addFloor(this.model).then(ok => {
        console.log(ok[1]);
        this.refreshFloors();
      })
    }
    else {
      alert("Заполните все поля");
    }
  }

  deleteFloor($event) {
    var target = $event.target || $event.srcElement || $event.currentTarget;
    var idAttr = target.attributes.id;
    var id = parseInt(idAttr.nodeValue.substr(2));
    var p_url = this.data.find(function (item) {
      if (item.id == id) {
        return true;
      }
      else {
        return false;
      }
    }).p_url;
    this.dt.delFloor(id, p_url).then(res => {
      this.data.forEach(function (item) {
        if (item.id == id) {
          item.deleted = true;
        }
      });
      confirm("Этаж удалён");
    })

  }

  refreshFloors() {
    this.dt.getFloors(this.model.BuildingID).then(floors => {
      floors.forEach(function (item) {
        item.deleted = false;
        item.p_url = item.p_url.substr(1);
      });
      this.data = floors.sort((obj1, obj2) => obj1.level - obj2.level);
      this.bounds_options=[];
      var $this = this;
      this.data.forEach(function(floor){
        $this.mapOptions($this.imgPrefix+floor.p_url, floor.level);
      });
      this.source.load(this.data);
    });
  }

  validate() {
    if (isUndefined(this.model.Name) || isUndefined(this.model.Level) || isUndefined(this.model.Length) || isUndefined(this.model.Width) || isUndefined(this.model.Height) || this.inputFileModel.length == 0) {
      return false;
    }
    return true;
  }

  mapOptions(img_url, level) {
    this.dt.getImgSize(img_url).then(sizes=>{
      var width = sizes[0];
      var height = sizes[1];
      var bounds = latLngBounds([0, width], [height, 0]);
      this.bounds_options[level-1] =
        [
          {
            layers: [
              imageOverlay(img_url, bounds)
            ],
            minZoom: -3,
            maxZoom: 1,
            crs: CRS.Simple,
            maxBounds: bounds,
            center: bounds.getCenter(),
          },
          bounds
        ];
    });

  }


}
