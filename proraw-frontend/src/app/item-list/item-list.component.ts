import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Item } from '../item';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  isServer: boolean;
  currentItems: Item[] = [];
  currentItemsSubscription: Subscription;
  currentLoadStatus$: Observable<boolean>;
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cd: CatalogDataService,
    private route: ActivatedRoute,
    private dd: DeviceDetectorService,
    private ls: LoaderService
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit() {
    this.currentLoadStatus$ = this.ls.loaderStatus$;
    this.currentItemsSubscription = this.route.paramMap
      .pipe(
        map(data => +data.get('id')),
        switchMap(id => this.cd.getItemsByCategoryId(id))
      )
      .subscribe(items => {
        this.currentItems = items;
        this.ls.setLoaderStatus(false);
      });
  }

  ngOnDestroy() {
    if (this.currentItemsSubscription) {
      this.currentItemsSubscription.unsubscribe();
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
