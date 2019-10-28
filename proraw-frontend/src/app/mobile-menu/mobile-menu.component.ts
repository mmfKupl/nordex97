import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Output() isOpenChanges = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}

  onCloseMenu() {
    this.isOpenChanges.emit(false);
    this.isOpen = false;
  }

  get displayClasses() {
    return {
      'mobile-menu--open': this.isOpen
    };
  }
}
