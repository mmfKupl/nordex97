import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Link } from '../broad-crumb';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() isMobile = false;

  links: Link[] = [
    { title: 'О компании', link: '/about' },
    { title: 'Доставка', link: '/delivery' },
    { title: 'Реквизиты', link: '/requisites' }
  ];

  constructor() {}

  ngOnInit() {}
}
