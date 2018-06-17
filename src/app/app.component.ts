import {Component, OnInit} from '@angular/core';
import { MessagingService } from "./providers/messaging.service";
import {NotificationsService} from "angular2-notifications";
import {DataproviderService} from "./providers/dataprovider.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  message;
  public options = {
    position: ["bottom", "right"],
    timeOut: 0,
    lastOnBottom: true,
    maxStack: 10,
    clickToClose: true,
    showProgressBar: false,
  };

  constructor(private msgService: MessagingService, private _service: NotificationsService, private dt: DataproviderService) {}

  ngOnInit() {
    this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
    var $this = this;
    $this.dt.getNoifications().then(data=>{
      console.log(data);
      data.forEach(function(item){
        $this.open(item);
      })
    });
    setInterval(function(){
      $this.dt.getNoifications().then(data=>{
        console.log(data);
        data.forEach(function(item){
          $this.open(item);
        })
      })
    }, 301000)

  }

  open(item){
    var $this = this;
    this.dt.getApStat().then(aps=>{
      console.log(aps);
      var re = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/ig;
      var macs = item.Message.match(re);//(re,'<a>$&</a>');
      macs.forEach(function(mac){
        var find_aps = aps.find(function(ap){
          if(ap.bsnAPDot3MacAddress==(mac.replace(new RegExp(':', 'g'),' ')+' ').toUpperCase()){
            item.Message = item.Message.replace(mac,'<a href="/apinfo/'+ap.bsnAPName+'">$&</a>')
            return true;
          }
          else{
            return false;
          }
        });
      });
      $this.dt.getClientStat().then(clients=>{
        macs.forEach(function(mac){
          var find_clients = clients.find(function(client) {
            if (client.bsnMobileStationMacAddress == (mac.replace(new RegExp(':', 'g'), ' ') + ' ').toUpperCase()) {
              item.Message = item.Message.replace(mac,'<a href="/clientinfo/'+client.bsnMobileStationMacAddress.replace(new RegExp(' ','g'),'_')+'">$&</a>')
              return true;
            }
            else {
              return false;
            }
          });
          });

        this._service.error("Report time: "+item.DeviceReportedTime,item.Message);
      })


    })

  }
}
