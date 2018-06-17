import {Component, OnInit} from '@angular/core';
import {Floor} from "../model/floor";
import {Router, ActivatedRoute} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";
import {isUndefined} from "util";
import {CRS, imageOverlay, latLng, latLngBounds, tileLayer, Map} from "leaflet";
import * as L from 'leaflet';
import {NgProgress} from "@ngx-progressbar/core";
declare var HeatmapOverlay;
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})

export class BuildingComponent implements OnInit {

  inputFileModel = [];
  addNew = false;
  model = new Floor();
  public problem_layers=[];
  public heatmap_layers=[];
  public error: string = null;
  public data: any;
  public source = new LocalDataSource();
  public deleted: boolean = false;
  public bounds_options=[];
  public ap_layers =[];
  public aps =[];
  public finished_ajax=0;
  constructor(private dt: DataproviderService, private router: Router, private route: ActivatedRoute, public progress: NgProgress) {
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
    var $this = this;
    this.dt.getAllAps().then(aps => {
      $this.aps = aps;
    }).then(()=>{
      $this.refreshFloors();
    });


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
  updateFloor($event){
    var target = $event.target || $event.srcElement || $event.currentTarget;
    var idAttr = target.attributes.id;
    var id = parseInt(idAttr.nodeValue.substr(2));
    this.router.navigate(['floor/' + id]);
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
        var ap_layer = new L.FeatureGroup();
        var curr_aps = $this.aps.filter(function(ap){
          if (ap.floorID===floor.id){
            return true;
          }
          else{
            return false;
          }
        });
        var onIcon = L.icon({
          iconUrl: '../../assets/images/router_on.png',
          iconSize: [24, 24],
        });
        var offIcon = L.icon({
          iconUrl: '../../assets/images/router_on.png',
          iconSize: [24, 24],
        });
        curr_aps.forEach(function (ap) {
          L.marker(L.latLng(ap.y, ap.x), {
            icon: (ap.status == 'ON') ? onIcon : offIcon,
            draggable: false,
          })
            .bindPopup('<a href="apinfo/' + ap.name + '">' + ap.name + '</a>')
            .addTo(ap_layer);
        });
        var cfg = {
          radius: (60),
          scaleRadius: true,
          latField: "y",
          lngField: "x",
          valueField: "power",
        };
        $this.progress.start();
        $this.heatmap_layers[floor.level-1] = new HeatmapOverlay(cfg);
        $this.problem_layers[floor.level-1] = L.layerGroup();
        $this.dt.getHm(floor.id, 50).then(points => {
          var problems = points.filter(point => {
            return ((point.noize / point.sig) >= 0.7 && point.sig>=10);
          });
          var warnIcon = L.icon({
            iconUrl: '../../assets/images/warning-sign.png',
            iconSize: [24, 24],
          });
          problems.forEach(function (point) {
            if ($this.problem_layers[floor.level-1]) {
              L.marker(L.latLng(point.y, point.x), {
                icon : warnIcon,
              })
                .bindPopup(
                  '<p>Channel №'+point.channel+'<br>' +
                  'Signal '+point.sig.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.sig_point+'">'+point.sig_point+'</a><br>' +
                  'Noize '+point.noize.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.noize_point+'">'+point.noize_point+'</a><br>' +
                  '</p>')
                .addTo($this.problem_layers[floor.level-1]);
            }
          });
          var hm_data = {max: 200, min: 0, data: points};
          $this.heatmap_layers[floor.level-1].setData(hm_data);
          $this.finished_ajax+=1;
          if($this.finished_ajax==$this.heatmap_layers.length) {
            $this.progress.complete();
          }
        });

        $this.mapOptions($this.imgPrefix+floor.p_url, floor.level,ap_layer);
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

  mapOptions(img_url, level, layer) {
    var $this = this;
    this.dt.getImgSize(img_url).then(sizes=>{
      var width = sizes[0];
      var height = sizes[1];
      var bounds = latLngBounds([0, width], [height, 0]);
      this.bounds_options[level-1] =
        [
          {
            layers: [
              imageOverlay(img_url, bounds,{
                "opacity": 0.4,
              }).bringToFront(),
              layer,
              $this.heatmap_layers[level-1],
              $this.problem_layers[level-1],
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
