import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;
  routeSubscription: Subscription;
  searchStr: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
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
