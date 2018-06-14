import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {control, CRS, icon, imageOverlay, latLngBounds, Map} from "leaflet";
import {LeafletDirective} from "@asymmetrik/ngx-leaflet";
import {NgProgress} from "@ngx-progressbar/core";
import {isNumber} from "util";


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
  public chosen_aps = [];
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
    },
    edit:{'featureGroup': this.editableLayers}
  };
  public scale = '50';
  private curr_aps = [];
  private hm_data;

  constructor(private dt: DataproviderService, private router: Router, private route: ActivatedRoute, public progress: NgProgress) {
    this.floorId = this.route.snapshot.params["id"];
  }

  public hmLayer;
  public problemLayer;
  private problems;

  ngOnInit() {
    this.refreshFloor();

  }

  refreshFloor() {
    var $this = this;
    this.dt.getFloor(this.floorId).then(floor => {
      console.log(floor);
      var img_url = $this.imgPrefix + floor.p_url.substr(1);
      return img_url
    }).then((img_url) => {
      $this.mapOptions(img_url);
    });
  }

  mapOptions(img_url) {
    var $this = this;
    this.dt.getImgSize(img_url).then(sizes => {
      console.log(sizes);
      var width = sizes[0];
      var height = sizes[1];
      var bounds = latLngBounds([0, width], [height, 0]);
      $this.map_options =
        [
          {
            layers: [
              imageOverlay(img_url, bounds, {
                "opacity": 0.4,
              }).bringToFront(),
              this.editableLayers
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

  onFocus(x, y) {
    console.log(x, y);
    var map = this.leafletDirective.getMap();
    map.setView(L.latLng(y, x), -1);
    map.openPopup('This is me!', L.latLng(y, x));
  }

  buttonClick() {
    console.log(this.chosen_aps);
    this.dt.updateAps(this.chosen_aps).then(res => {
      console.log(res);
      window.location.reload();
    })
  }

  getMap() {
    this.progress.start();
    let map = this.leafletDirective.getMap();
    if (this.hmLayer) {
      map.removeLayer(this.hmLayer);
    }
    if (this.problemLayer) {
      map.removeLayer(this.problemLayer);
    }
    this.radius = parseInt(this.scale) + parseInt('10');


    let $this = this;
    this.dt.getHm(this.floorId, this.scale).then(points => {

      $this.problems = points.filter(point => {
        return ((point.noize / point.sig) >= 0.7 && point.sig>=10);
      });
      $this.problemLayer = L.layerGroup();
      var warnIcon = L.icon({
        iconUrl: '../../assets/images/warning-sign.png',
        iconSize: [24, 24],
      });
      $this.problems.forEach(function (point) {
        if ($this.problemLayer) {
          L.marker(L.latLng(point.y, point.x), {
            icon : warnIcon,
          })
            .bindPopup(
              '<p>Channel №'+point.channel+'<br>' +
              'Signal '+point.sig.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.sig_point+'">'+point.sig_point+'</a><br>' +
              'Noize '+point.noize.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.noize_point+'">'+point.noize_point+'</a><br>' +
              '</p>')
            .addTo($this.problemLayer);
        }
      });
      this.problemLayer.addTo(map);

      this.hm_data = {max: 150, min: 0, data: points};
      var cfg = {
        radius: $this.radius,
        scaleRadius: true,
        latField: "y",
        lngField: "x",
        valueField: "power",

      };
      $this.hmLayer = new HeatmapOverlay(cfg);
      console.log($this.hmLayer);
      $this.hmLayer.setData(this.hm_data);
      $this.hmLayer.addTo(map);
      $this.progress.complete();
    })
  }

  public radius = parseInt(this.scale)+10;

  changeRadius() {
    console.log(this.radius);
    let map = this.leafletDirective.getMap();
    map.removeLayer(this.hmLayer);
    map.removeLayer(this.problemLayer);
    var cfg = {
      radius: (this.radius),
      scaleRadius: true,
      latField: "y",
      lngField: "x",
      valueField: "power",
    };
    this.hmLayer = new HeatmapOverlay(cfg);
    this.hmLayer.setData(this.hm_data);
    var $this = this;
    var warnIcon = L.icon({
      iconUrl: '../../assets/images/warning-sign.png',
      iconSize: [24, 24],
    });
    this.problems.forEach(function (point) {
      if ($this.problemLayer) {
        L.marker(L.latLng(point.y, point.x), {
          icon : warnIcon,
        })
          .bindPopup(
            '<p>Channel №'+point.channel+'<br>' +
            'Signal '+point.sig.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.sig_point+'">'+point.sig_point+'</a><br>' +
            'Noize '+point.noize.toFixed(2)+'(mW) is from: <a href="/apinfo/'+point.noize_point+'">'+point.noize_point+'</a><br>' +
            '</p>')
          .addTo($this.problemLayer);
      }
    });
    this.problemLayer.addTo(map);
    this.hmLayer.addTo(map);
  }
  onMapReady(map :Map){
    console.log(map);
    var $this = this;
    $this.dt.getAllAps().then(aps => {
      $this.data = [];
      aps.forEach(function (ap) {
        $this.data.push({id: ap.id, name: ap.name});
      });
      $this.curr_aps = aps.filter(function (ap) {
        if (ap.floorID == $this.floorId) {
          return true;
        }
        else {
          return false;
        }
      });
      $this.data.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });
      var onIcon = L.icon({
        iconUrl: '../../assets/images/router_on.png',
        iconSize: [24, 24],
      });
      var offIcon = L.icon({
        iconUrl: '../../assets/images/router_on.png',
        iconSize: [24, 24],
      });
      console.log($this.curr_aps);
      $this.curr_aps.forEach(function (ap) {
        var marker = L.marker(L.latLng(ap.y, ap.x), {
          icon: (ap.status == 'ON') ? onIcon : offIcon,
          draggable: false,
        })
          .bindPopup('<a href="apinfo/' + ap.name + '">' + ap.name + '</a>')
          .addTo($this.editableLayers);
      });
      map.on(L.Draw.Event.CREATED, function (event : any) {
        console.log("CREATED");
        console.log(event.layer);

        $this.chosen_aps[$this.chosen_aps.length] = {
          id: "",
          x: event.layer._latlng.lng,
          y: event.layer._latlng.lat,
          floorID: $this.floorId
        };
      });
      map.on(L.Draw.Event.EDITED, function (event : any) {
        var aps=[];
        Object.keys(event.layers._layers).forEach(function(item){
          var ap_name = event.layers._layers[item]._popup._content.match(new RegExp('>(.*?)<','g'))[0].slice(1, -1);
          aps.push({
            name:ap_name,
            lat:event.layers._layers[item]._latlng.lat,
            lng: event.layers._layers[item]._latlng.lng
          });
        });
        console.log(aps);
        $this.dt.moveAps(JSON.stringify(aps)).then(res=>{
          console.log(res);
          window.location.reload();
        });
      });
      map.on(L.Draw.Event.DELETED, function (event : any) {
        console.log("DELETED");
        console.log(event.layers);
        var aps=[];
        Object.keys(event.layers._layers).forEach(function(item){
          aps.push(event.layers._layers[item]._popup._content.match(new RegExp('>(.*?)<','g'))[0].slice(1, -1));
        });
        $this.dt.removeAps(aps).then(res=>{
          console.log(res);
          window.location.reload();
        })
      });

    });


  }

}
