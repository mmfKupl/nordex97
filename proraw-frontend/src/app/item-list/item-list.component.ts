import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener
} from '@angular/core';
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
  currentItems: Item[] = [];
  currentItemsSubscription: Subscription;
  currentLoadStatus$: Observable<boolean>;
  constructor(
    private cd: CatalogDataService,
    private route: ActivatedRoute,
    private dd: DeviceDetectorService,
    private ls: LoaderService
  ) {}

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
    this.currentItemsSubscription.unsubscribe();
  }

  get isMobileWidth() {
    return window.innerWidth <= 900;
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }
}
