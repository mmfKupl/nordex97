import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { Category } from 'src/app/category';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() isMobile = false;
  categories: Category[];
  curExpandId: {} = {};
  constructor(private cd: CatalogDataService) {}

  ngOnInit() {
    const tempIL = this.cd.getCategories();
    if (Array.isArray(tempIL)) {
      this.categories = tempIL;
    } else {
      tempIL.subscribe((data: any[]) => (this.categories = data));
    }
  }

  setCurExpand(i: number) {
    if (i in this.curExpandId) {
      this.curExpandId[i] = this.curExpandId[i] ? null : i;
    } else {
      this.curExpandId[i] = i;
    }
  }

  getCurClass(expanId: number) {
    if (!expanId) {
      return false;
    }
    return this.curExpandId && expanId === this.curExpandId[expanId];
  }

  getExpandStyle(amountOfItems: number = 0, expand = false) {
    return expand || this.isMobile ? amountOfItems * 14 * 3 : 0;
  }
}
