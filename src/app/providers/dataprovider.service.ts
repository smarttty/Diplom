import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

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


}
