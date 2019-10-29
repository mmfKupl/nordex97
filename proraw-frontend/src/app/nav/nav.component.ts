import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from '../broad-crumb';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() isMobile = false;
  @Output() lickClick = new EventEmitter<boolean>(false);

  links: Link[] = [
    { title: 'О компании', link: '/about' },
    { title: 'Доставка', link: '/delivery' },
    { title: 'Реквизиты', link: '/requisites' }
  ];

  constructor() {}

  ngOnInit() {}

  onLinkClick() {
    this.lickClick.emit(true);
  }
}
