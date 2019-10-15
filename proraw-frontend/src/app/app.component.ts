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
  switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  searchPlaceholder = 'Поиск по каталогу';
  searchSubscription: Subscription;

  constructor(private cd: CatalogDataService) {}

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
        debounceTime(700),
        map(event => event.target.value.trim()),
        filter(value => !!value && value.length > 1),
        distinctUntilChanged(),
        switchMap((str: string) => this.cd.getSearchedData(str))
      )
      .subscribe(data => console.log(data));
  }
}
