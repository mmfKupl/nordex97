import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ItemList } from '../item-list';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  curItemListIdSubscription: Subscription;
  curItemListId: number;
  curItemList$: Observable<ItemList[]>;
  constructor(private cd: CatalogDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.curItemListIdSubscription = this.route.paramMap.subscribe(
      (data: ParamMap) => {
        this.curItemListId = +data.get('id');
        this.curItemList$ = this.cd.getCurItemList(this.curItemListId);
      }
    );
  }

  ngOnDestroy() {
    this.curItemListIdSubscription.unsubscribe();
  }
}
