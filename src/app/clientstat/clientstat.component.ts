import {Component, OnInit} from '@angular/core';
import {DataproviderService} from "../providers/dataprovider.service";
import {Router} from "@angular/router";
import {LocalDataSource, Ng2SmartTableModule} from 'ng2-smart-table';

@Component({
  selector: 'app-clientstat',
  templateUrl: './clientstat.component.html',
  styleUrls: ['./clientstat.component.css']
})
export class ClientstatComponent implements OnInit {


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
  data = [];
  selectedClient: string = null;
  dropdownSettings = {};
  public source = new LocalDataSource();
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

  constructor(public dt: DataproviderService, private router: Router) {
    if (localStorage.getItem('clientstat_table_settings') !== null) {
      this.visible_properties = JSON.parse(localStorage.getItem('clientstat_table_settings'));
    }
    this.refreshTableColumns();
    if (localStorage.getItem('clientstat_table_perPage') !== null) {
      this.perPage = JSON.parse(localStorage.getItem('clientstat_table_perPage'));
    }
    this.refreshTablePerPage();
  }

  ngOnInit() {
    var $this = this;
    this.dt.getClientStat().then(ClientArray => {
      this.data = ClientArray;
      this.dt.clients = ClientArray;
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

  onClientSelect($event) {
      this.router.navigate(["clientinfo/" + $event.data.bsnMobileStationMacAddress.replace(new RegExp(" ","g"),'_')]);
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
    localStorage.setItem('clientstat_table_settings', JSON.stringify(this.visible_properties));
  }

  refreshTableData() {
    this.dt.getClientStat().then(ClientArray => {
      this.data = ClientArray;
      this.dt.clients = ClientArray;
      this.source.load(this.data);
      this.source.refresh();
    }, reason => {
      alert("Контроллер не отвечает");
    });

  }

  refreshTablePerPage() {
    var newSettings = this.settings;
    newSettings.pager.perPage = this.perPage;
    this.settings = Object.assign({}, newSettings);
    localStorage.setItem('clientstat_table_perPage', JSON.stringify(this.perPage));
  }
}
