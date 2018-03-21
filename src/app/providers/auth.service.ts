import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from "@angular/router";
import { Observable } from 'rxjs/Observable';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AuthService implements CanActivate{
  user: Observable<firebase.User>;
  error: Observable<string>;
  constructor(public firebaseAuth: AngularFireAuth, private router : Router) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(this.user);
        window.location.href='';
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut().then(value=>{
      window.location.href='login';
    });
  }
  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|boolean {
    return this.firebaseAuth.authState.map((auth) => {
      if (auth) {
        console.log('authenticated');
        return true;
      }
      console.log('not authenticated');
      this.router.navigateByUrl('/login');
      return false;
    }); // this might not be necessary - ensure `first` is imported if you use it
  }

}
