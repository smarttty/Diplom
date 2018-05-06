import {Injectable} from '@angular/core';
import {Http, RequestMethod, RequestOptions, Headers} from '@angular/http';
import {Building} from "../model/building";

@Injectable()
export class DataproviderService {

  constructor(private http: Http) {
  }

  public selectedAp: any;
  public aps: any;
  public ap_properties = ['bsnAPDot3MacAddress',

    'bsnAPNumOfSlots',

    'bsnAPName',

    'bsnAPLocation',

    'bsnAPMonitorOnlyMode',

    'bsnAPOperationStatus',

    'bsnAPSoftwareVersion',

    'bsnAPBootVersion',

    'bsnAPPrimaryMwarName',

    'bsnAPReset',

    'bsnAPStatsTimer',

    'bsnAPPortNumber',

    'bsnAPModel',

    'bsnAPSerialNumber',

    'bsnAPClearConfig',

    'bsnApIpAddress',

    'bsnAPMirrorMode',

    'bsnAPRemoteModeSupport',

    'bsnAPType',

    'bsnAPSecondaryMwarName',

    'bsnAPTertiaryMwarName',

    'bsnAPIsStaticIP',

    'bsnAPNetmask',

    'bsnAPGateway',

    'bsnAPStaticIPAddress',

    'bsnAPBridgingSupport',

    'bsnAPGroupVlanName',

    'bsnAPIOSVersion',

    'bsnAPCertificateType',

    'bsnAPEthernetMacAddress',

    'bsnAPAdminStatus'];
  public client_properties = ['bsnMobileStationMacAddress',

    'bsnMobileStationIpAddress',

    'bsnMobileStationUserName',

    'bsnMobileStationAPMacAddr',

    'bsnMobileStationAPIfSlotId',

    'bsnMobileStationEssIndex',

    'bsnMobileStationSsid',

    'bsnMobileStationAID',

    'bsnMobileStationStatus',

    'bsnMobileStationReasonCode',

    'bsnMobileStationMobilityStatus',

    'bsnMobileStationAnchorAddress',

    'bsnMobileStationCFPollable',

    'bsnMobileStationCFPollRequest',

    'bsnMobileStationChannelAgilityEnabled',

    'bsnMobileStationPBCCOptionImplemented',

    'bsnMobileStationShortPreambleOptionImplemented',

    'bsnMobileStationSessionTimeout',

    'bsnMobileStationAuthenticationAlgorithm',

    'bsnMobileStationWepState',

    'bsnMobileStationPortNumber',

    'bsnMobileStationDeleteAction',

    'bsnMobileStationPolicyManagerState',

    'bsnMobileStationSecurityPolicyStatus',

    'bsnMobileStationProtocol',

    'bsnMobileStationMirrorMode',

    'bsnMobileStationInterface',

    'bsnMobileStationApMode',

    'bsnMobileStationVlanId',

    'bsnMobileStationPolicyType',

    'bsnMobileStationEncryptionCypher',

    'bsnMobileStationEapType',

    'bsnMobileStationCcxVersion',

    'bsnMobileStationE2eVersion',

    'bsnMobileStationStatusCode'];
  public clients: any;

  public getApStat(): Promise<any> {
    var $this = this;
    return this.http.get('http://212.192.88.199/snmp_show.php',).toPromise().then(function (response) {
      var ApEntryTemp = response.json();
      var i = 0;

      while (ApEntryTemp[i].indexOf('STRING') !== -1) {
        i++;
      }
      var numberAps = i;
      var numberParam = ApEntryTemp.length / numberAps;
      var ap = {};
      var ApArray = [];
      for (let i = 0; i < numberAps; i++) {
        for (let j = 0; j < numberParam; j++) {
          ap[$this.ap_properties[j]] = ApEntryTemp[i + j * numberAps].replace(new RegExp('"', 'g'), '').split(': ')[1];
        }
        ApArray.push(ap);
        ap = {};
      }
      return ApArray
    })
  }

  public getClientStat(): Promise<any> {
    var $this = this;
    return this.http.get('http://212.192.88.199/snmp_clients.php').toPromise().then(function (response) {

      var ClientEntryTemp = response.json();
      var i = 0;
      while (ClientEntryTemp[i].indexOf('STRING') !== -1) {
        i++;
      }
      var numberAps = i;
      var numberParam = ClientEntryTemp.length / numberAps;
      var client = {};
      var ClientArray = [];
      for (let i = 0; i < numberAps; i++) {
        for (let j = 0; j < numberParam; j++) {
          client[$this.client_properties[j]] = ClientEntryTemp[i + j * numberAps].replace(new RegExp('"', 'g'), '').split(': ')[1];
        }
        ClientArray.push(client);
        client = {};
      }
      return ClientArray
    })
  }
  public addBuilding(building : Building) : Promise<any>{

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let options = new RequestOptions( {method: RequestMethod.Post, headers: headers });

    let body = this.serializeObj(building);
    return this.http.post('http://212.192.88.199/buildings.php', body, options).toPromise().then(res=> {
      return [res.ok,res.text()];
      }
    )
  }
  public addFloor(floor : any) : Promise<any>{

    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded;'});
    let options = new RequestOptions( {method: RequestMethod.Post, headers: headers });
    var body = this.serializeObj(floor);
    return this.http.post('http://212.192.88.199/floors.php', body, options).toPromise().then(res=> {
        return [res.ok, res.text()];
      }
    )
  }
  private serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  public getAllBuildings() : Promise<any>{
    return this.http.get('http://212.192.88.199/buildings.php').toPromise().then(res=> {
        return JSON.parse(res.text());
      }
    )
  }
  public getFloors(buildingId) : Promise<any>{
    return this.http.get('http://212.192.88.199/floors.php').toPromise().then(res=> {
        var floorsArr = JSON.parse(res.text());
        floorsArr = floorsArr.filter(item => {
            return item.buildingId == buildingId.toString();
        });
      return floorsArr;
      }
    )
  }
  public getFloor(floorId) : Promise<any>{
    return this.http.get('http://212.192.88.199/floors.php').toPromise().then(res=> {
        var floorsArr = JSON.parse(res.text());
        floorsArr = floorsArr.filter(item => {
          return item.id == floorId.toString();
        });
        return floorsArr[0];
      }
    )
  }
  public delFloor(floorId, plan_url) : Promise<any>{
    return this.http.delete('http://212.192.88.199/floors.php?id='+floorId+'&link='+plan_url).toPromise().then(res=>{
      return res;
    })
  }
  public getLogs(mac, offset){
    return this.http.get('http://212.192.88.199/logs.php?mac='+mac+'&offset='+offset).toPromise().then(res=>{
      return JSON.parse(res.text());

    })
  }
  public delBuilding(buildId) : Promise<any>{
    return this.http.delete('http://212.192.88.199/buildings.php?id='+buildId).toPromise().then(res=>{
      return res;
    })
  }
  public getImgSize(url) : Promise<any>{
    return this.http.get('http://212.192.88.199/img_size.php?url='+url).toPromise().then(res=>{
      return JSON.parse(res.text());
    })
  }


}
