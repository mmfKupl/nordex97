import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { fromEvent, Subscription, of, combineLatest, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { CatalogDataService } from './catalog-data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Link } from './broad-crumb';
import { Category } from './category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;
  searchStr: string;
  dataFetched = false;

  currentCategory: Link;
  currentCategorySubscription: Subscription;

  currentPage: Link;
  currentPageSubscription: Subscription;

  // TODO:
  // when all stuff will work -> change to false
  mobileMenuOpenStatus = false;

  constructor(
    private router: Router,
    private cd: CatalogDataService,
    private dd: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        if (this.isMobile) {
          const urls = e.url.split('/').filter(Boolean);
          this.currentCategorySubscription = this.getCurrentCategory(
            urls
          ).subscribe(cur => (this.currentCategory = cur));
          this.currentPageSubscription = this.getCurrentPage(urls).subscribe(
            cur => (this.currentPage = cur)
          );
        }
        if (!e.url.includes('search') && !!this.searchInput) {
          this.searchInput.nativeElement.value = null;
          this.searchStr = '';
        }
      });
  }

  getCurrentCategory(url: string[]): Observable<Link | null> {
    const [, category] = url;
    if (+category >= 0) {
      const obs = this.cd.getCurrentCategory(+category).pipe(
        map(v => ({
          title: v.Title || 'не найден',
          link: v.IDCategory ? `catalog/${v.IDCategory}` : 'catalog'
        }))
      );
      return obs;
    }
    return of(null);
  }

  getCurrentPage(url: string[]): Observable<Link | null> {
    const [link] = url;
    if (link === 'catalog') {
      return of({ title: 'Каталог', link });
    }
    if (link === 'requisites') {
      return of({ title: 'Реквизиты', link });
    }
    if (link === 'about') {
      return of({ title: 'О компании', link });
    }
    if (link === 'delivery') {
      return of({ title: 'Доставка', link });
    }
    return null;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    if (this.isMobile) {
      this.currentCategorySubscription.unsubscribe();
      this.currentPageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent<any>(
      this.searchInput.nativeElement,
      'input'
    )
      .pipe(
        map(event => event.target.value.trim()),
        filter(value => !!value && value.length > 1),
        tap(str => (this.searchStr = str)),
        distinctUntilChanged()
      )
      .subscribe();
  }

  onEnter() {
    if (this.searchStr) {
      this.router.navigate(['catalog/search'], {
        queryParams: { query: this.searchStr }
      });
    }
  }

  openMobileMenu() {
    this.mobileMenuOpenStatus = true;
  }

  onMobileStatusChanged(nextStatus: boolean) {
    this.mobileMenuOpenStatus = nextStatus;
  }

  get isNotMobile() {
    return !this.dd.isMobile();
  }

  get isMobile() {
    return this.dd.isMobile();
  }
}
