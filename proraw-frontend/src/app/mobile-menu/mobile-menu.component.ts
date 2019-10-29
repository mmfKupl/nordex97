import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Output() isOpenChanges = new EventEmitter<boolean>(false);

  constructor(private dd: DeviceDetectorService) {}

  ngOnInit() {}

  onCloseMenu() {
    this.isOpenChanges.emit(false);
    this.isOpen = false;
  }

  onLickClick() {
    this.onCloseMenu();
  }

  get displayClasses() {
    return {
      'mobile-menu--open': this.isOpen
    };
  }

  get isMobile() {
    return this.dd.isMobile();
  }
}
