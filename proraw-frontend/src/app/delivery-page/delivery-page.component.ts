import {
  Component,
  OnInit,
  HostListener,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss']
})
export class DeliveryPageComponent implements OnInit {
  isServer: boolean;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private dd: DeviceDetectorService
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit() {}

  get isMobileWidth() {
    if (this.isServer) {
      return false;
    }
    return window.innerWidth <= 900;
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }
}
