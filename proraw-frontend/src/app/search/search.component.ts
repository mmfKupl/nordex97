import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogDataService } from '../catalog-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { Item } from '../item';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoaderService } from '../loader.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  itemsSubscription: Subscription;
  currentLoadStatus$: Observable<boolean> = of(false);
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private route: ActivatedRoute,
    private cd: CatalogDataService,
    private dd: DeviceDetectorService,
    private ls: LoaderService
  ) { this.isBrowser = isPlatformBrowser(platformId)}

  ngOnInit() {
    this.currentLoadStatus$ = this.ls.loaderStatus$;
    this.itemsSubscription = this.route.queryParamMap
      .pipe(
        map(data => data.get('query')),
        switchMap(query => this.cd.getSearchedData(query))
      )
      .subscribe(items => {
        this.items = items;
        this.ls.setLoaderStatus(false);
      });
  }

  ngOnDestroy() {
    this.itemsSubscription && this.itemsSubscription.unsubscribe();
  }

  get isMobileWidth() {
    if(this.isBrowser){
      return window.innerWidth <= 900;
    }else{
      return false;
    }
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }
}
