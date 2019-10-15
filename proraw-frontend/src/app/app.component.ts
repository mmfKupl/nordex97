import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CatalogDataService } from './catalog/catalog-data.service';
import { fromEvent, Subscription } from 'rxjs';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  mergeMap
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;
  searchStr: string;

  constructor(
    private cd: CatalogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
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
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((str: string) => this.cd.getSearchedData(str))
      )
      .subscribe(data => console.log(data));
  }

  onEnter() {
    this.router.navigate(['catalog/search'], {
      queryParams: { query: this.searchStr }
    });
  }
}
