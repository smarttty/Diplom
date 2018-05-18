import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {control, CRS, icon, imageOverlay, latLngBounds} from "leaflet";
import {LeafletDirective} from "@asymmetrik/ngx-leaflet";
import scale = control.scale;



declare var L;
declare var HeatmapOverlay;

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
  public drawOptions = {
    position: 'topright',
    draw: {
      marker: {
        icon: icon({
          iconSize: [24, 24],
          iconUrl: '../../assets/images/router_marker.png',
        }),
      },
      polyline: false,
      circle: false,
      polygon: false,
      rectangle: false,
      circlemarker: false,
    }
  };
  public scale=30;
  private curr_aps=[];
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
              imageOverlay(img_url, bounds,{
                "opacity":0.5,
              }).bringToBack()
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
          $this.data.push({id:ap.id, name:ap.name});
        });
        $this.curr_aps = aps.filter(function(ap){
          if(ap.floorID==$this.floorId){
            return true;
          }
          else {
            return false;
          }
        });
        $this.data.sort(function(a, b){
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a должно быть равным b
          return 0;
        })
      });
    }).then(()=>{
      setTimeout(function(){
        var onIcon = L.icon({
          iconUrl: '../../assets/images/router_on.png',
          iconSize: [24, 24],
        });
        var offIcon = L.icon({
          iconUrl: '../../assets/images/router_on.png',
          iconSize: [24, 24],
        });
        $this.curr_aps.forEach(function(ap){
          var marker = L.marker(L.latLng(ap.y,ap.x),{
            icon : (ap.status=='ON') ? onIcon : offIcon,
            draggable: true,
          })
            .bindPopup('<a href="apinfo/'+ap.name+'">'+ap.name+'</a>')
            .addTo($this.leafletDirective.getMap());
        });
        $this.leafletDirective.getMap().on(L.Draw.Event.CREATED, function (event) {
          console.log("CREATED");
          console.log(event.layer);

          $this.chosen_aps[$this.chosen_aps.length]={id:"",x:event.layer._latlng.lng,y:event.layer._latlng.lat,floorID:$this.floorId};

        });
      },1000);


    });


  }
  onFocus(x,y){
    console.log(x,y);
    var map = this.leafletDirective.getMap();
    map.setView(L.latLng(y,x),-1);
    map.openPopup('This is me!', L.latLng(y,x));
  }
  buttonClick(){
    console.log(this.chosen_aps);
    this.dt.updateAps(this.chosen_aps).then(res=>{
      console.log(res);
    })
  }
  getMap(){
    var $this=this;
    this.dt.getHm(this.floorId, this.scale).then(points=>{


    let data={max:24,min:0,data:points};
    var cfg={
      radius:this.scale+10,
      scaleRadius:true,
      latField:"y",
      lngField:"x",
      valueField:"power",

    };
    let hm = new HeatmapOverlay(cfg);
    console.log(hm);
    hm.setData(data);
    hm.addTo($this.leafletDirective.getMap());
    })
  }

}
