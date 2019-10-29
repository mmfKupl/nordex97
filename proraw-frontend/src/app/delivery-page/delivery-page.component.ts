import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss']
})
export class DeliveryPageComponent implements OnInit {
  constructor(private dd: DeviceDetectorService) {}

  ngOnInit() {}

  get isMobile() {
    return this.dd.isMobile();
  }
}
