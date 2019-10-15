import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  curItemListId: number;
  currentItems$: Observable<Item[] | object>;
  constructor(private cd: CatalogDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.currentItems$ = this.route.paramMap.pipe(
      map(data => +data.get('id')),
      tap(id => (this.curItemListId = id)),
      switchMap(id => this.cd.getItemsByCategoryId(id))
    );
  }

  ngOnDestroy() {}
}
