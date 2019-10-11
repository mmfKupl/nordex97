import { Component, OnInit } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  itemList: any[];
  curExpandId: {} = {};
  constructor(private cd: CatalogDataService) {}

  ngOnInit() {
    this.itemList = this.cd.itemList;
  }

  setCurExpand(i: number) {
    if (i in this.curExpandId) {
      this.curExpandId[i] = this.curExpandId[i] ? null : i;
    } else {
      this.curExpandId[i] = i;
    }
  }

  getCurClass(expanId: number, e: Event) {
    if (!expanId) {
      return false;
    }
    return this.curExpandId && expanId === this.curExpandId[expanId];
  }
}
