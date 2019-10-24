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
import { Link } from './broad-crumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;
  routeSubscription: Subscription;
  searchStr: string;
  currentBroadCrumbs$: Observable<Link[]>;
  dataFetched = false;

  constructor(private router: Router, private cd: CatalogDataService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentBroadCrumbs$ = this.getBreadCrumbs(
          e.url.split('/').filter(Boolean)
        );
        if (!e.url.includes('search') && !!this.searchInput) {
          this.searchInput.nativeElement.value = null;
          this.searchStr = '';
        }
      });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  getBreadCrumbs(url: string[]): Observable<Link[]> {
    const [catalog, category, item] = url;
    const maped = [];
    if (catalog === 'catalog') {
      maped.push(of({ title: 'Каталог', link: 'catalog' }));
    }
    if (catalog === 'requisites') {
      maped.push(of({ title: 'Реквизиты', link: 'requisites' }));
    }
    if (+category >= 0) {
      const obs = this.cd.getCurrentCategory(+category).pipe(
        map(v => ({
          title: v.Title || 'не найден',
          link: v.IDCategory ? `catalog/${v.IDCategory}` : 'catalog'
        }))
      );
      maped.push(obs);
    }
    if (+item >= 0) {
      const obs = this.cd.getItemByIdAndCategoryId(+item, +category).pipe(
        map(v => ({
          title: v.Title || 'не найден',
          link: v.IDItem
            ? `catalog/${v.IDCategory}/${v.IDItem}`
            : `catalog/${+category}`
        }))
      );
      maped.push(obs);
    }
    return combineLatest(maped) as Observable<Link[]>;
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
}
