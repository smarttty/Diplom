import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {DataproviderService} from "../providers/dataprovider.service";
import {LocalDataSource} from "ng2-smart-table";

@Component({
  selector: 'app-clientinfo',
  templateUrl: './clientinfo.component.html',
  styleUrls: ['./clientinfo.component.css']
})
export class ClientinfoComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dt: DataproviderService) {
    if (localStorage.getItem('clientinfo_ap_table_settings') !== null) {
      this.visible_properties = JSON.parse(localStorage.getItem('clientinfo_ap_table_settings'));
    }
    else if (localStorage.getItem('apstat_table_settings') !== null) {
      this.visible_properties = JSON.parse(localStorage.getItem('apstat_table_settings'));
    }
    this.dropdownSettings = {
      text: "Отображаемые столбцы",
      selectAllText: 'Выбрать все',
      unSelectAllText: 'Убрать',
      pullRight: true,
    };
    this.refreshTableColumns();

  }

  perPage: number = 20;
  perPageArray = [{name: '5', value: 5}, {name: '10', value: 10}, {name: '20', value: 20}, {
    name: '50',
    value: 50
  }, {name: '100', value: 100}, {name: '200', value: 200}];

  settings = {
    columns: {},
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 20,
    },
    rowClassFunction: (row) => {
      if (row.data.selected === true) {
        return 'green';
      } else {
        return '';
      }
    }

  };
  public source = new LocalDataSource();
  clientMac: string;
  client: any;
  public clientAp: any;
  clientProperties : any;
  public visible_properties = [{'id': 0, 'item': 'bsnAPDot3MacAddress', 'itemName': 'MAC-адрес'},
    {'id': 1, 'item': 'bsnAPNumOfSlots', 'itemName': 'Количество интерфейсов'},
    {'id': 2, 'item': 'bsnAPName', 'itemName': 'Название'},
    {'id': 3, 'item': 'bsnAPLocation', 'itemName': 'Месторасположение'},
    {'id': 4, 'item': 'bsnAPMonitorOnlyMode', 'itemName': 'bsnAPMonitorOnlyMode'},
    {'id': 5, 'item': 'bsnAPOperationStatus', 'itemName': 'bsnAPOperationStatus'},
    {'id': 6, 'item': 'bsnAPSoftwareVersion', 'itemName': 'Версия ПО'},
    {'id': 7, 'item': 'bsnAPBootVersion', 'itemName': 'Загрузочная версия'},
    {'id': 8, 'item': 'bsnAPPrimaryMwarName', 'itemName': 'Коммутатор'},
    {'id': 9, 'item': 'bsnAPReset', 'itemName': 'Перезагрузка'},
    {'id': 10, 'item': 'bsnAPStatsTimer', 'itemName': 'bsnAPStatsTimer'},
    {'id': 11, 'item': 'bsnAPPortNumber', 'itemName': 'Номер порта'},
    {'id': 12, 'item': 'bsnAPModel', 'itemName': 'Модель'},
    {'id': 13, 'item': 'bsnAPSerialNumber', 'itemName': 'Серийный номер'},
    {'id': 14, 'item': 'bsnAPClearConfig', 'itemName': 'Очистить конфиг'},
    {'id': 15, 'item': 'bsnApIpAddress', 'itemName': 'IP-адрес'},
    {'id': 16, 'item': 'bsnAPMirrorMode', 'itemName': 'Режим зеркалирования'},
    {'id': 17, 'item': 'bsnAPRemoteModeSupport', 'itemName': 'bsnAPRemoteModeSupport'},
    {'id': 18, 'item': 'bsnAPType', 'itemName': 'Тип'},
    {'id': 19, 'item': 'bsnAPSecondaryMwarName', 'itemName': 'bsnAPSecondaryMwarName'},
    {'id': 20, 'item': 'bsnAPTertiaryMwarName', 'itemName': 'bsnAPTertiaryMwarName'},
    {'id': 21, 'item': 'bsnAPIsStaticIP', 'itemName': 'Статичный IP-адрес?'},
    {'id': 22, 'item': 'bsnAPNetmask', 'itemName': 'Маска сети'},
    {'id': 23, 'item': 'bsnAPGateway', 'itemName': 'Шлюз'},
    {'id': 24, 'item': 'bsnAPStaticIPAddress', 'itemName': 'Статичный IP-адрес'},
    {'id': 25, 'item': 'bsnAPBridgingSupport', 'itemName': 'bsnAPBridgingSupport'},
    {'id': 26, 'item': 'bsnAPGroupVlanName', 'itemName': 'VLAN'},
    {'id': 27, 'item': 'bsnAPIOSVersion', 'itemName': 'Версия IOS'},
    {'id': 28, 'item': 'bsnAPCertificateType', 'itemName': 'bsnAPCertificateType'},
    {'id': 29, 'item': 'bsnAPEthernetMacAddress', 'itemName': 'MAC-адрес Etheret'},
    {'id': 30, 'item': 'bsnAPAdminStatus', 'itemName': 'bsnAPAdminStatus'},

  ];
  public ap_properties = [
    {'id': 0, 'item': 'bsnAPDot3MacAddress', 'itemName': 'MAC-адрес'},
    {'id': 1, 'item': 'bsnAPNumOfSlots', 'itemName': 'Количество интерфейсов'},
    {'id': 2, 'item': 'bsnAPName', 'itemName': 'Название'},
    {'id': 3, 'item': 'bsnAPLocation', 'itemName': 'Месторасположение'},
    {'id': 4, 'item': 'bsnAPMonitorOnlyMode', 'itemName': 'bsnAPMonitorOnlyMode'},
    {'id': 5, 'item': 'bsnAPOperationStatus', 'itemName': 'bsnAPOperationStatus'},
    {'id': 6, 'item': 'bsnAPSoftwareVersion', 'itemName': 'Версия ПО'},
    {'id': 7, 'item': 'bsnAPBootVersion', 'itemName': 'Загрузочная версия'},
    {'id': 8, 'item': 'bsnAPPrimaryMwarName', 'itemName': 'Коммутатор'},
    {'id': 9, 'item': 'bsnAPReset', 'itemName': 'Перезагрузка'},
    {'id': 10, 'item': 'bsnAPStatsTimer', 'itemName': 'bsnAPStatsTimer'},
    {'id': 11, 'item': 'bsnAPPortNumber', 'itemName': 'Номер порта'},
    {'id': 12, 'item': 'bsnAPModel', 'itemName': 'Модель'},
    {'id': 13, 'item': 'bsnAPSerialNumber', 'itemName': 'Серийный номер'},
    {'id': 14, 'item': 'bsnAPClearConfig', 'itemName': 'Очистить конфиг'},
    {'id': 15, 'item': 'bsnApIpAddress', 'itemName': 'IP-адрес'},
    {'id': 16, 'item': 'bsnAPMirrorMode', 'itemName': 'Режим зеркалирования'},
    {'id': 17, 'item': 'bsnAPRemoteModeSupport', 'itemName': 'bsnAPRemoteModeSupport'},
    {'id': 18, 'item': 'bsnAPType', 'itemName': 'Тип'},
    {'id': 19, 'item': 'bsnAPSecondaryMwarName', 'itemName': 'bsnAPSecondaryMwarName'},
    {'id': 20, 'item': 'bsnAPTertiaryMwarName', 'itemName': 'bsnAPTertiaryMwarName'},
    {'id': 21, 'item': 'bsnAPIsStaticIP', 'itemName': 'Статичный IP-адрес?'},
    {'id': 22, 'item': 'bsnAPNetmask', 'itemName': 'Маска сети'},
    {'id': 23, 'item': 'bsnAPGateway', 'itemName': 'Шлюз'},
    {'id': 24, 'item': 'bsnAPStaticIPAddress', 'itemName': 'Статичный IP-адрес'},
    {'id': 25, 'item': 'bsnAPBridgingSupport', 'itemName': 'bsnAPBridgingSupport'},
    {'id': 26, 'item': 'bsnAPGroupVlanName', 'itemName': 'VLAN'},
    {'id': 27, 'item': 'bsnAPIOSVersion', 'itemName': 'Версия IOS'},
    {'id': 28, 'item': 'bsnAPCertificateType', 'itemName': 'bsnAPCertificateType'},
    {'id': 29, 'item': 'bsnAPEthernetMacAddress', 'itemName': 'MAC-адрес Etheret'},
    {'id': 30, 'item': 'bsnAPAdminStatus', 'itemName': 'bsnAPAdminStatus'},

  ];
  dropdownSettings = {};
  public logs : string="";
  ngOnInit() {
    var $this = this;
    this.clientMac = this.route.snapshot.params['mac'].replace(new RegExp('_', 'g'), ' ');
    this.clientProperties = this.dt.client_properties;
    this.dt.getClientStat()
      .then(ClientArray => {
        $this.client = ClientArray.filter(function (obj) {
          return obj.bsnMobileStationMacAddress == $this.clientMac;
        })[0];
        return $this.client;
      })
      .then(client => {
      $this.dt.getApStat().then(apArray => {
        $this.clientAp = apArray.filter(function (obj) {
            return obj.bsnAPDot3MacAddress == client.bsnMobileStationAPMacAddr;
          }
        )[0];
        $this.clientAp.selected=false;
        console.log(this.clientAp);
        this.source.load([this.clientAp]);
      });

    });
    this.getLogs();
  }
  refreshTableColumns() {
    var newSettings = this.settings;
    var set_columns = {};
    var $this = this;
    this.visible_properties.forEach(function (item, index) {
      set_columns[item.item] = {"title": item.itemName};
    });
    newSettings.columns = set_columns;
    this.settings = Object.assign({}, newSettings);
    localStorage.setItem('clientinfo_ap_table_settings', JSON.stringify(this.visible_properties));
  }
  refreshTablePerPage() {
    var newSettings = this.settings;
    newSettings.pager.perPage = this.perPage;
    this.settings = Object.assign({}, newSettings);
    localStorage.setItem('apinfo_client_table_perPage', JSON.stringify(this.perPage));
    this.refreshAllData();
  }
  public refreshAllData() {
    var $this = this;
    this.dt.getClientStat()
      .then(ClientArray => {
        $this.client = ClientArray.filter(function (obj) {
          return obj.bsnMobileStationMacAddress == $this.clientMac;
        })[0];
        return $this.client;
      })
      .then(client => {
        $this.dt.getApStat().then(apArray => {
          $this.clientAp = apArray.filter(function (obj) {
              return obj.bsnAPDot3MacAddress == client.bsnMobileStationAPMacAddr;
            }
          )[0];
          this.clientAp.selected = false;
          this.source.load([this.clientAp]);
        });

      })
  }
  onApSelect($event) {
    if($event.data.selected) {
      this.router.navigate(["apinfo/" + $event.data.bsnAPName]);
    }
    else{
      this.clientAp.selected= false;
      $event.data.selected=true;
    }
  }
  getLogs(){
    var mac = this.clientMac.replace(/ /g, ':');
    mac = mac.replace(/[A-Z]/g,"$&").toLowerCase();
    mac=mac.substr(0,mac.length-1);
    console.log(mac);
    var $this = this;
    this.dt.getLogs(mac, 0).then(res=> {
        res.forEach(function(item){
          $this.logs+=item[0]+": "+item[1]+"\n";
        })
      }
    )
  }
}
