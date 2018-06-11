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
    timeOut: 30000,
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

    this._service.error("Report time: "+item.DeviceReportedTime,item.Message);
  }
}
