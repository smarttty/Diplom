import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { AuthService } from '../providers/auth.service';
import {ReactiveFormsModule,FormsModule,FormGroup, FormControl} from "@angular/forms";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public _router : any;
  constructor(private router: Router, public authService: AuthService) {
    this._router = router;
  }

  ngOnInit() {
  }
  logout() {
    this.authService.logout();
  }
  search(form){
    console.log(form.value);
  }

}
