import { Component, OnInit } from '@angular/core';
import {DataproviderService} from "../providers/dataprovider.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-apinfo',
  templateUrl: './apinfo.component.html',
  styleUrls: ['./apinfo.component.css'],
})
export class ApinfoComponent implements OnInit {

  public ap : any;
  private apName : string;
  public apProperties: any;
  constructor(private router: Router, private route: ActivatedRoute, public dt: DataproviderService) {

  }

  ngOnInit() {
    this.apName = this.route.snapshot.params["name"];
    this.apProperties = this.dt.ap_properties;
    this.ap = this.dt.selectedAp;
    if (!this.dt.selectedAp && !this.dt.aps) {
      var $this = this;
      this.dt.getApStat().then(
        ApArray => {
          $this.ap = ApArray.filter(function (obj) {
            return obj.bsnAPName == $this.apName;
          })[0];
        })
    }

  }
}
