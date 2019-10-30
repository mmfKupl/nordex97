import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogDataService } from '../catalog-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { Item } from '../item';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  itemsSubscription: Subscription;
  currentLoadStatus$: Observable<boolean> = of(false);

  constructor(
    private route: ActivatedRoute,
    private cd: CatalogDataService,
    private dd: DeviceDetectorService,
    private ls: LoaderService
  ) {}

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
    this.itemsSubscription.unsubscribe();
  }

  get isMobileWidth() {
    return window.innerWidth <= 900;
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }
}
