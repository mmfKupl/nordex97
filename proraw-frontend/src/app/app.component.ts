import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  PLATFORM_ID,
  OnDestroy,
  HostListener,
  Inject
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { fromEvent, Subscription, of, combineLatest, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { CatalogDataService } from './catalog-data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Link } from './broad-crumb';
import { Category } from './category';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  currentLoaderStatus = false;
  currentLoaderStatusSubscription: Subscription;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;
  searchStr: string;
  dataFetched = false;
  currentUrl: string;

  isBrowser: boolean;
  isServer: boolean;

  currentCategory: Link;
  currentCategorySubscription: Subscription;

  currentPage: Link;
  currentPageSubscription: Subscription;

  mobileMenuOpenStatus = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
    private cd: CatalogDataService,
    private dd: DeviceDetectorService,
    private ls: LoaderService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
  }

  @HostListener('window:resize')
  isMobileWidth() {
    if (this.isServer) {
      return false;
    }
    return window.innerWidth <= 900;
  }

  ngOnInit() {
    this.currentLoaderStatusSubscription = this.ls.loaderStatus$.subscribe(
      d => {
        setTimeout(() => {
          this.currentLoaderStatus = d;
        });
      }
    );
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl = e.url;
        const urls = e.url.split('/').filter(Boolean);
        this.currentCategorySubscription = this.getCurrentCategory(
          urls
        ).subscribe(cur => {
          this.currentCategory = cur;
        });
        this.currentPageSubscription = this.getCurrentPage(urls).subscribe(
          cur => {
            this.currentPage = cur;
          }
        );
        if (!e.url.includes('search') && !!this.searchInput) {
          this.searchInput.nativeElement.value = null;
          this.searchStr = '';
        }
      });
  }

  getCurrentCategory(url: string[]): Observable<Link | null> {
    const [, category] = url;
    if (+category >= 0) {
      return this.cd.getCurrentCategory(+category).pipe(
        map(v => ({
          title: v.Title || 'не найден',
          link: v.IDCategory ? `catalog/${v.IDCategory}` : 'catalog'
        }))
      );
    } else if (category && category.includes('search')) {
      return of({ title: 'Поиск по каталогу', link: '' });
    }
    return of(null);
  }

  getCurrentPage(url: string[]): Observable<Link | null> {
    const [link] = url;
    if (link === 'catalog') {
      return of({ title: 'Каталог товаров', link });
    }
    if (link === 'requisites') {
      return of({ title: 'Реквизиты', link });
    }
    if (link === 'delivery') {
      return of({ title: 'Доставка', link });
    }
    return of({ title: 'О компании', link });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.currentLoaderStatusSubscription) {
      this.currentLoaderStatusSubscription.unsubscribe();
    }
    if (this.isMobile) {
      if (this.currentCategorySubscription) {
        this.currentCategorySubscription.unsubscribe();
      }
      if (this.currentPageSubscription) {
        this.currentPageSubscription.unsubscribe();
      }
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
    return !this.dd.isMobile() && !this.isMobileWidth();
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth();
  }

  @HostListener('window:scroll')
  isScrollTopButtonVisible() {
    if (this.isServer) {
      return false;
    }
    const regCatalog = /catalog\/\d*$/g;
    const regSearch = /catalog\/search/g;
    return (
      window.pageYOffset >= 400 &&
      (regCatalog.test(this.currentUrl) || regSearch.test(this.currentUrl))
    );
  }

  get isShowAppCatalogList() {
    return (
      this.isNotMobile ||
      (this.currentPage &&
        this.currentPage.link === 'catalog' &&
        !this.currentCategory)
    );
  }
}
