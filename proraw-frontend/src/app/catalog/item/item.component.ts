import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ItemList } from '../item-list';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy {
  curentItemListId: number;
  curentItemId: number;
  curentItem: ItemList;
  constructor(private cd: CatalogDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.curentItemListId = +this.route.snapshot.url[0].path;
    this.curentItemId = +this.route.snapshot.url[1].path;
    this.cd
      .getCurItem(this.curentItemListId, this.curentItemId)
      .subscribe(data => console.log(data));
  }

  ngOnDestroy() {}
}
