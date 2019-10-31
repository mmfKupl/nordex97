import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
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
  isServer: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private dd: DeviceDetectorService
  ) {
    this.isServer = isPlatformServer(platformId);
  }

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

  get isMobileWidth() {
    if (this.isServer) {
      return false;
    }
    return window.innerWidth <= 900;
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }

  get mobileHeight() {
    if (this.isServer) {
      return `100vh`;
    }
    const vh = window.innerHeight;
    return `${vh}px`;
  }
}
