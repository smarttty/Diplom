import { Component, OnInit, OnDestroy } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {LocalDataSource, Ng2SmartTableModule} from 'ng2-smart-table';
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import {DataproviderService} from '../providers/dataprovider.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-apstat',
  templateUrl: './apstat.component.html',
  styleUrls: ['./apstat.component.css'],
})
export class ApstatComponent implements OnInit, OnDestroy {

  //table settings
  settings = {
    columns: {},
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager:{
      perPage:20,
    }

  };
  data = [];
  //dropdown settings
  dropdownSettings = {};

  selectedAp : any;
  public visible_properties = [{'id':0,'item':'bsnAPDot3MacAddress','itemName':'MAC-адрес'},
    {'id':1,'item':    'bsnAPNumOfSlots','itemName':'Количество интерфейсов'},
    {'id':2,'item':    'bsnAPName','itemName':'Название'},
    {'id':3,'item':    'bsnAPLocation','itemName':'Месторасположение'},
    {'id':4,'item':    'bsnAPMonitorOnlyMode','itemName':'bsnAPMonitorOnlyMode'},
    {'id':5,'item':    'bsnAPOperationStatus','itemName':'bsnAPOperationStatus'},
    {'id':6,'item':    'bsnAPSoftwareVersion','itemName':'Версия ПО'},
    {'id':7,'item':    'bsnAPBootVersion','itemName':'Загрузочная версия'},
    {'id':8,'item':    'bsnAPPrimaryMwarName','itemName':'Коммутатор'},
    {'id':9,'item':    'bsnAPReset','itemName':'Перезагрузка'},
    {'id':10,'item':    'bsnAPStatsTimer','itemName':'bsnAPStatsTimer'},
    {'id':11,'item':    'bsnAPPortNumber','itemName':'Номер порта'},
    {'id':12,'item':    'bsnAPModel','itemName':'Модель'},
    {'id':13,'item':    'bsnAPSerialNumber','itemName':'Серийный номер'},
    {'id':14,'item':    'bsnAPClearConfig','itemName':'Очистить конфиг'},
    {'id':15,'item':    'bsnApIpAddress','itemName':'IP-адрес'},
    {'id':16,'item':    'bsnAPMirrorMode','itemName':'Режим зеркалирования'},
    {'id':17,'item':    'bsnAPRemoteModeSupport','itemName':'bsnAPRemoteModeSupport'},
    {'id':18,'item':    'bsnAPType','itemName':'Тип'},
    {'id':19,'item':    'bsnAPSecondaryMwarName','itemName':'bsnAPSecondaryMwarName'},
    {'id':20,'item':    'bsnAPTertiaryMwarName','itemName':'bsnAPTertiaryMwarName'},
    {'id':21,'item':    'bsnAPIsStaticIP','itemName':'Статичный IP-адрес?'},
    {'id':22,'item':    'bsnAPNetmask','itemName':'Маска сети'},
    {'id':23,'item':    'bsnAPGateway','itemName':'Шлюз'},
    {'id':24,'item':    'bsnAPStaticIPAddress','itemName':'Статичный IP-адрес'},
    {'id':25,'item':    'bsnAPBridgingSupport','itemName':'bsnAPBridgingSupport'},
    {'id':26,'item':    'bsnAPGroupVlanName','itemName':'VLAN'},
    {'id':27,'item':    'bsnAPIOSVersion','itemName':'Версия IOS'},
    {'id':28,'item':    'bsnAPCertificateType','itemName':'bsnAPCertificateType'},
    {'id':29,'item':    'bsnAPEthernetMacAddress','itemName':'MAC-адрес Etheret'},
    {'id':30,'item':    'bsnAPAdminStatus','itemName':'bsnAPAdminStatus'},

  ];
  public ap_properties=[
    {'id':0,'item':'bsnAPDot3MacAddress','itemName':'MAC-адрес'},
    {'id':1,'item':    'bsnAPNumOfSlots','itemName':'Количество интерфейсов'},
    {'id':2,'item':    'bsnAPName','itemName':'Название'},
    {'id':3,'item':    'bsnAPLocation','itemName':'Месторасположение'},
    {'id':4,'item':    'bsnAPMonitorOnlyMode','itemName':'bsnAPMonitorOnlyMode'},
    {'id':5,'item':    'bsnAPOperationStatus','itemName':'bsnAPOperationStatus'},
    {'id':6,'item':    'bsnAPSoftwareVersion','itemName':'Версия ПО'},
    {'id':7,'item':    'bsnAPBootVersion','itemName':'Загрузочная версия'},
    {'id':8,'item':    'bsnAPPrimaryMwarName','itemName':'Коммутатор'},
    {'id':9,'item':    'bsnAPReset','itemName':'Перезагрузка'},
    {'id':10,'item':    'bsnAPStatsTimer','itemName':'bsnAPStatsTimer'},
    {'id':11,'item':    'bsnAPPortNumber','itemName':'Номер порта'},
    {'id':12,'item':    'bsnAPModel','itemName':'Модель'},
    {'id':13,'item':    'bsnAPSerialNumber','itemName':'Серийный номер'},
    {'id':14,'item':    'bsnAPClearConfig','itemName':'Очистить конфиг'},
    {'id':15,'item':    'bsnApIpAddress','itemName':'IP-адрес'},
    {'id':16,'item':    'bsnAPMirrorMode','itemName':'Режим зеркалирования'},
    {'id':17,'item':    'bsnAPRemoteModeSupport','itemName':'bsnAPRemoteModeSupport'},
    {'id':18,'item':    'bsnAPType','itemName':'Тип'},
    {'id':19,'item':    'bsnAPSecondaryMwarName','itemName':'bsnAPSecondaryMwarName'},
    {'id':20,'item':    'bsnAPTertiaryMwarName','itemName':'bsnAPTertiaryMwarName'},
    {'id':21,'item':    'bsnAPIsStaticIP','itemName':'Статичный IP-адрес?'},
    {'id':22,'item':    'bsnAPNetmask','itemName':'Маска сети'},
    {'id':23,'item':    'bsnAPGateway','itemName':'Шлюз'},
    {'id':24,'item':    'bsnAPStaticIPAddress','itemName':'Статичный IP-адрес'},
    {'id':25,'item':    'bsnAPBridgingSupport','itemName':'bsnAPBridgingSupport'},
    {'id':26,'item':    'bsnAPGroupVlanName','itemName':'VLAN'},
    {'id':27,'item':    'bsnAPIOSVersion','itemName':'Версия IOS'},
    {'id':28,'item':    'bsnAPCertificateType','itemName':'bsnAPCertificateType'},
    {'id':29,'item':    'bsnAPEthernetMacAddress','itemName':'MAC-адрес Etheret'},
    {'id':30,'item':    'bsnAPAdminStatus','itemName':'bsnAPAdminStatus'},

  ];
  public source = new LocalDataSource();
  constructor(private http:Http, public dt : DataproviderService, private router: Router) {
    if(localStorage.getItem('apstat_table_settings')===null) {
      this.refreshSettingsTable();
    }
    else{
      this.visible_properties = JSON.parse(localStorage.getItem('apstat_table_settings'));
      this.refreshSettingsTable();
    }
  }



  ngOnInit() {
    var $this = this;
    this.dt.getApStat().then(ApArray => {
      this.data = ApArray;
      this.dt.aps = ApArray;
      this.source.load(this.data);
    }, reason => {
      alert("Контроллер не отвечает");
    });
    this.dropdownSettings = {
      text: "Отображаемые столбцы",
      selectAllText: 'Выбрать все',
      unSelectAllText: 'Убрать',
      pullRight: true,
    }

  }
  ngOnDestroy(){
    this.dt.selectedAp = this.selectedAp;
  }
  onApSelect($event){
    this.selectedAp = $event.data;
    this.router.navigate(["apinfo/"+this.selectedAp.bsnAPName]);
  }
  refreshSettingsTable(){
    var newSettings = this.settings;
    var set_columns = {};
    var $this = this;
    this.visible_properties.forEach(function(item, index){
      set_columns[item.item] = {"title" : item.itemName};
    });
    newSettings.columns = set_columns;
    this.settings = Object.assign({},newSettings);
    localStorage.setItem('apstat_table_settings', JSON.stringify(this.visible_properties));
  }
  public refreshTableData(){
    this.dt.getApStat().then(ApArray => {
      this.data = ApArray;
      this.dt.aps = ApArray;
      this.source.load(this.data);
      this.source.refresh();

    }, reason => {
      alert("Контроллер не отвечает");
    });
  }

}
