import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {DataproviderService} from "./dataprovider.service";

@Injectable()
export class MessagingService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private dt : DataproviderService) {
  }


  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;
      const data = {[user.uid]: token};
      this.db.object('fcmTokens/').update(data);
      /*var tkn;
      var $this = this;
      this.getToken().then(obj=>{
        tkn = obj.toString()}
      ).then(()=>{
        $this.dt.updateDeviceToken({user:user.uid,token:token}).then(res=>
          {
            console.log(res);
          }
        )
      })*/


    })
  }

  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log('WOWOWOWOWOWO');
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    });

  }

}
