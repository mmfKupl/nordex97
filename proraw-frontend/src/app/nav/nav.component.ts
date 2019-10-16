import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BroadCrumb } from '../broad-crumb';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() broadCrumbs$: Observable<BroadCrumb[]>;

  constructor() {}

  ngOnInit() {}
}
