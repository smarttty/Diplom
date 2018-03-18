import {Component, OnInit} from '@angular/core';
import {DataproviderService} from "../providers/dataprovider.service";
import {Router, ActivatedRoute} from "@angular/router";
import {LocalDataSource} from "ng2-smart-table";

@Component({
  selector: 'app-apinfo',
  templateUrl: './apinfo.component.html',
  styleUrls: ['./apinfo.component.css'],
})
export class ApinfoComponent implements OnInit {

  public ap: any;
  public apName: string;
  public apProperties: any;
  public apClients: any;
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
    }

  };
  dropdownSettings = {};
  public client_properties = [{'id': 0, 'item': 'bsnMobileStationMacAddress', 'itemName': 'MAC-адрес'},
    {'id': 1, 'item': 'bsnMobileStationIpAddress', 'itemName': 'IP-адрес'},
    {'id': 2, 'item': 'bsnMobileStationUserName', 'itemName': 'Имя пользователя'},
    {'id': 3, 'item': 'bsnMobileStationAPMacAddr', 'itemName': 'MAC-адрес точки доступа'},
    {'id': 4, 'item': 'bsnMobileStationAPIfSlotId', 'itemName': 'ID интерфейса'},
    {'id': 5, 'item': 'bsnMobileStationEssIndex', 'itemName': 'ESS индекс'},
    {'id': 6, 'item': 'bsnMobileStationSsid', 'itemName': 'SSID'},
    {'id': 7, 'item': 'bsnMobileStationAID', 'itemName': 'AID'},
    {'id': 8, 'item': 'bsnMobileStationStatus', 'itemName': 'Статус'},
    {'id': 9, 'item': 'bsnMobileStationReasonCode', 'itemName': 'bsnMobileStationReasonCode'},
    {'id': 10, 'item': 'bsnMobileStationMobilityStatus', 'itemName': 'bsnMobileStationMobilityStatus'},
    {'id': 11, 'item': 'bsnMobileStationAnchorAddress', 'itemName': 'bsnMobileStationAnchorAddress'},
    {'id': 12, 'item': 'bsnMobileStationCFPollable', 'itemName': 'bsnMobileStationCFPollable'},
    {'id': 13, 'item': 'bsnMobileStationCFPollRequest', 'itemName': 'bsnMobileStationCFPollRequest'},
    {'id': 14, 'item': 'bsnMobileStationChannelAgilityEnabled', 'itemName': 'bsnMobileStationChannelAgilityEnabled'},
    {'id': 15, 'item': 'bsnMobileStationPBCCOptionImplemented', 'itemName': 'bsnMobileStationPBCCOptionImplemented'},
    {
      'id': 16,
      'item': 'bsnMobileStationShortPreambleOptionImplemented',
      'itemName': 'bsnMobileStationShortPreambleOptionImplemented'
    },
    {'id': 17, 'item': 'bsnMobileStationSessionTimeout', 'itemName': 'bsnMobileStationSessionTimeout'},
    {'id': 18, 'item': 'bsnMobileStationAuthenticationAlgorithm', 'itemName': 'Алгоритм аутентификации'},
    {'id': 19, 'item': 'bsnMobileStationWepState', 'itemName': 'bsnMobileStationWepState'},
    {'id': 20, 'item': 'bsnMobileStationPortNumber', 'itemName': 'Порт'},
    {'id': 21, 'item': 'bsnMobileStationDeleteAction', 'itemName': 'bsnMobileStationDeleteAction'},
    {'id': 22, 'item': 'bsnMobileStationPolicyManagerState', 'itemName': 'bsnMobileStationPolicyManagerState'},
    {'id': 23, 'item': 'bsnMobileStationSecurityPolicyStatus', 'itemName': 'bsnMobileStationSecurityPolicyStatus'},
    {'id': 24, 'item': 'bsnMobileStationProtocol', 'itemName': 'Протокол'},
    {'id': 25, 'item': 'bsnMobileStationMirrorMode', 'itemName': 'Режим зеркалирования'},
    {'id': 26, 'item': 'bsnMobileStationInterface', 'itemName': 'Интерфейс'},
    {'id': 27, 'item': 'bsnMobileStationApMode', 'itemName': 'ApMode'},
    {'id': 28, 'item': 'bsnMobileStationVlanId', 'itemName': 'VLAN ID'},
    {'id': 29, 'item': 'bsnMobileStationPolicyType', 'itemName': 'Policy type'},
    {'id': 30, 'item': 'bsnMobileStationEncryptionCypher', 'itemName': 'Шифрование'},
    {'id': 31, 'item': 'bsnMobileStationEapType', 'itemName': 'EAP'},
    {'id': 32, 'item': 'bsnMobileStationCcxVersion', 'itemName': 'Версия CCX'},
    {'id': 33, 'item': 'bsnMobileStationE2eVersion', 'itemName': 'Версия E2E'},
    {'id': 34, 'item': 'bsnMobileStationStatusCode', 'itemName': 'Код статуса'},
  ];
  public visible_properties = [{'id': 0, 'item': 'bsnMobileStationMacAddress', 'itemName': 'MAC-адрес'},
    {'id': 1, 'item': 'bsnMobileStationIpAddress', 'itemName': 'IP-адрес'},
    {'id': 2, 'item': 'bsnMobileStationUserName', 'itemName': 'Имя пользователя'},
    {'id': 3, 'item': 'bsnMobileStationAPMacAddr', 'itemName': 'MAC-адрес точки доступа'},
    {'id': 4, 'item': 'bsnMobileStationAPIfSlotId', 'itemName': 'ID интерфейса'},
    {'id': 5, 'item': 'bsnMobileStationEssIndex', 'itemName': 'ESS индекс'},
    {'id': 6, 'item': 'bsnMobileStationSsid', 'itemName': 'SSID'},
    {'id': 7, 'item': 'bsnMobileStationAID', 'itemName': 'AID'},
    {'id': 8, 'item': 'bsnMobileStationStatus', 'itemName': 'Статус'},
    {'id': 9, 'item': 'bsnMobileStationReasonCode', 'itemName': 'bsnMobileStationReasonCode'},
    {'id': 10, 'item': 'bsnMobileStationMobilityStatus', 'itemName': 'bsnMobileStationMobilityStatus'},
    {'id': 11, 'item': 'bsnMobileStationAnchorAddress', 'itemName': 'bsnMobileStationAnchorAddress'},
    {'id': 12, 'item': 'bsnMobileStationCFPollable', 'itemName': 'bsnMobileStationCFPollable'},
    {'id': 13, 'item': 'bsnMobileStationCFPollRequest', 'itemName': 'bsnMobileStationCFPollRequest'},
    {'id': 14, 'item': 'bsnMobileStationChannelAgilityEnabled', 'itemName': 'bsnMobileStationChannelAgilityEnabled'},
    {'id': 15, 'item': 'bsnMobileStationPBCCOptionImplemented', 'itemName': 'bsnMobileStationPBCCOptionImplemented'},
    {
      'id': 16,
      'item': 'bsnMobileStationShortPreambleOptionImplemented',
      'itemName': 'bsnMobileStationShortPreambleOptionImplemented'
    },
    {'id': 17, 'item': 'bsnMobileStationSessionTimeout', 'itemName': 'bsnMobileStationSessionTimeout'},
    {'id': 18, 'item': 'bsnMobileStationAuthenticationAlgorithm', 'itemName': 'Алгоритм аутентификации'},
    {'id': 19, 'item': 'bsnMobileStationWepState', 'itemName': 'bsnMobileStationWepState'},
    {'id': 20, 'item': 'bsnMobileStationPortNumber', 'itemName': 'Порт'},
    {'id': 21, 'item': 'bsnMobileStationDeleteAction', 'itemName': 'bsnMobileStationDeleteAction'},
    {'id': 22, 'item': 'bsnMobileStationPolicyManagerState', 'itemName': 'bsnMobileStationPolicyManagerState'},
    {'id': 23, 'item': 'bsnMobileStationSecurityPolicyStatus', 'itemName': 'bsnMobileStationSecurityPolicyStatus'},
    {'id': 24, 'item': 'bsnMobileStationProtocol', 'itemName': 'Протокол'},
    {'id': 25, 'item': 'bsnMobileStationMirrorMode', 'itemName': 'Режим зеркалирования'},
    {'id': 26, 'item': 'bsnMobileStationInterface', 'itemName': 'Интерфейс'},
    {'id': 27, 'item': 'bsnMobileStationApMode', 'itemName': ''},
    {'id': 28, 'item': 'bsnMobileStationVlanId', 'itemName': 'VLAN ID'},
    {'id': 29, 'item': 'bsnMobileStationPolicyType', 'itemName': 'Policy type'},
    {'id': 30, 'item': 'bsnMobileStationEncryptionCypher', 'itemName': 'Шифрование'},
    {'id': 31, 'item': 'bsnMobileStationEapType', 'itemName': 'EAP'},
    {'id': 32, 'item': 'bsnMobileStationCcxVersion', 'itemName': 'Версия CCX'},
    {'id': 33, 'item': 'bsnMobileStationE2eVersion', 'itemName': 'Версия E2E'},
    {'id': 34, 'item': 'bsnMobileStationStatusCode', 'itemName': 'Код статуса'},
  ];
  public source = new LocalDataSource();
  private selectedClient : string = null;
  constructor(private router: Router, private route: ActivatedRoute, public dt: DataproviderService) {
    if (localStorage.getItem('apinfo_client_table_settings') !== null) {
      this.visible_properties = JSON.parse(localStorage.getItem('apinfo_client_table_settings'));
    }
    else if (localStorage.getItem('clientstat_table_settings') !== null) {
      this.visible_properties = JSON.parse(localStorage.getItem('clientstat_table_settings'));
    }
    this.refreshTableColumns();
    this.dropdownSettings = {
      text: "Отображаемые столбцы",
      selectAllText: 'Выбрать все',
      unSelectAllText: 'Убрать',
      pullRight: true,
    }
  }

  ngOnInit() {
    this.apName = this.route.snapshot.params["name"];
    this.apProperties = this.dt.ap_properties;
    var $this = this;
    this.dt.getApStat()
      .then(
        ApArray => {
          $this.ap = ApArray.filter(function (obj) {
            return obj.bsnAPName == $this.apName;
          })[0];
          return $this.ap;
        })
      .then(ap => {
        $this.dt.getClientStat()
          .then(ClientArray => {
            $this.apClients = ClientArray.filter(function (obj) {
              return obj.bsnMobileStationAPMacAddr == ap.bsnAPDot3MacAddress
            });
            this.source.load(this.apClients);
          });
      });
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
    localStorage.setItem('apinfo_client_table_settings', JSON.stringify(this.visible_properties));
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
    this.dt.getApStat()
      .then(
        ApArray => {
          $this.ap = ApArray.filter(function (obj) {
            return obj.bsnAPName == $this.apName;
          })[0];
          return $this.ap;
        })
      .then(ap => {
        $this.dt.getClientStat()
          .then(ClientArray => {
            $this.apClients = ClientArray.filter(function (obj) {
              return obj.bsnMobileStationAPMacAddr == ap.bsnAPDot3MacAddress
            });
            this.source.load(this.apClients);
          });
      });
  }
  onClientSelect($event) {
    console.log($event);
    if(this.selectedClient == $event.data.bsnMobileStationMacAddress) {
      this.router.navigate(["clientinfo/" + $event.data.bsnMobileStationMacAddress.replace(new RegExp(" ","g"),'_')]);
    }
    this.selectedClient = $event.data.bsnMobileStationMacAddress;
  }

}
