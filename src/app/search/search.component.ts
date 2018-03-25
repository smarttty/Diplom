import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router : Router, private route : ActivatedRoute) {
    console.log( this.route.snapshot.params["query"]);
  }

  ngOnInit() {
  }

}
