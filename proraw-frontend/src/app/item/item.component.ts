import { Component, OnInit, OnDestroy } from '@angular/core';
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
  currentCategoryId: number;
  curentItemId: number;
  curentItem: Item | any;
  itemProperty: string[][];

  getItemSubscription: Subscription;
  constructor(
    private cd: CatalogDataService,
    private route: ActivatedRoute,
    private dd: DeviceDetectorService
  ) {}

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
    this.getItemSubscription.unsubscribe();
  }

  get isMobile() {
    return this.dd.isMobile();
  }
}
