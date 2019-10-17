import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Item } from '../item';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  currentItems$: Observable<Item[]>;
  constructor(private cd: CatalogDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('?');
    this.currentItems$ = this.route.paramMap.pipe(
      tap(d => console.log(d)),
      map(data => +data.get('id')),
      switchMap(id => this.cd.getItemsByCategoryId(id))
    );
  }
}