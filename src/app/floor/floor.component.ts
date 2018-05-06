import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {CRS, icon, imageOverlay, latLngBounds} from "leaflet";
import {LeafletDirective} from "@asymmetrik/ngx-leaflet";
import * as L from 'leaflet';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})

export class FloorComponent implements OnInit {
  @ViewChild(LeafletDirective) leafletDirective;
  private floorId;
  public map_options;
  public imgPrefix = "http://212.192.88.199";
  public drawOptions = {
    position: 'topright',
    draw: {
      marker: {
        icon: icon({
          iconSize: [40, 40],
          iconUrl: '../../assets/images/ap.png',
        })
      },
      polyline: false,
      circle: false,
      polygon: false,
      rectangle: false,
      circlemarker: false,
    }
  };
  constructor(private dt: DataproviderService, private router: Router, private route: ActivatedRoute) {
    this.floorId = this.route.snapshot.params["id"];


  }

  ngOnInit() {
    this.refreshFloor();
  }

  refreshFloor() {
    var $this = this;
    this.dt.getFloor(this.floorId).then(floor => {
      console.log(floor);
      var img_url = $this.imgPrefix + floor.p_url.substr(1);
      $this.mapOptions(img_url);
      console.log(this.map_options);
      console.log(this.leafletDirective.getMap());

    });
  }
  mapOptions(img_url){
    var $this = this;
    this.dt.getImgSize(img_url).then(sizes=>{
      console.log(sizes);
      var width = sizes[0];
      var height = sizes[1];
      var bounds = latLngBounds([0, width], [height, 0]);
      $this.map_options =
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
    })
  }
  button(){
    console.log(this.leafletDirective.getMap());
  }

}
