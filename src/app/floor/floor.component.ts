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
  editableLayers = new L.FeatureGroup();
  private floorId;
  public map_options;
  public imgPrefix = "http://212.192.88.199";
  public data;
  public chosen_aps=[];
  public chosen_ap;
  public drawOptions = {
    position: 'topright',
    draw: {
      marker: {
        icon: icon({
          iconSize: [24, 24],
          iconUrl: '../../assets/images/router_marker.png',
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
      return img_url
    }).then((img_url)=>{
      $this.mapOptions(img_url);
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
    }).then(()=>{
      $this.dt.getAllAps().then(aps=>{
        $this.data=[];
        aps.forEach(function(ap){
          $this.data.push(ap.name);
        })
      });
    }).then(()=>{
      setTimeout(function(){
        var myIcon = L.icon({
          iconUrl: '../../assets/images/router_on.png',
          iconSize: [24, 24],
        });
        var marker = L.marker(L.latLng(100,100),{
          icon : myIcon
        });
        marker.addTo($this.leafletDirective.getMap());
        $this.leafletDirective.getMap().on(L.Draw.Event.CREATED, function (event) {
          console.log("CREATED");
          console.log(event.layer);

          $this.chosen_aps.push({point_id:$this.chosen_aps.length+1,id:"",x:event.layer._latlng.lng,y:event.layer._latlng.lat})
        });
      },1000);


    });


  }
  onFocus(id,x,y){
    console.log(id,x,y);
    this.leafletDirective.getMap().setView(L.latLng(y,x),-1);
  }

}
