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
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  isServer: boolean;
  currentCategoryId: number;
  curentItemId: number;
  curentItem: Item;
  itemProperty: string[][];

  getItemSubscription: Subscription;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cd: CatalogDataService,
    private route: ActivatedRoute,
    private dd: DeviceDetectorService,
    private readonly meta: MetaService
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
        this.meta.setTitle(this.curentItem.Title);
        this.meta.setTag(
          'keywords',
          this.curentItem.Keywords + ', ' + this.curentItem.VendorCode
        );
        this.itemProperty = this.curentItem.Property.split('\n').map(el =>
          el.split('|')
        );
      });
  }

  ngOnDestroy() {
    this.meta.setTitle('ООО Нордекс 97');
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
