import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Item } from '../item';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  isServer: boolean;
  currentCategoryId: number;
  curentItemId: number;
  curentItem: Item | any;
  itemProperty: string[][];

  getItemSubscription: Subscription;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cd: CatalogDataService,
    private route: ActivatedRoute,
    private dd: DeviceDetectorService
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit() {
    this.currentCategoryId = +this.route.snapshot.url[0].path;
    this.curentItemId = +this.route.snapshot.url[1].path;
    this.getItemSubscription = this.cd
      .getItemByIdAndCategoryId(this.curentItemId, this.currentCategoryId)
      .subscribe(data => {
        this.curentItem = data;
        this.itemProperty = this.curentItem.Property.split('\n').map(el =>
          el.split('|')
        );
      });
  }

  ngOnDestroy() {
    if (this.getItemSubscription) {
      this.getItemSubscription.unsubscribe();
    }
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
}
