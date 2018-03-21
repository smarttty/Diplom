import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  email: string;
  password: string;

  constructor(public authService: AuthService, private router : Router) {

  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }


}
