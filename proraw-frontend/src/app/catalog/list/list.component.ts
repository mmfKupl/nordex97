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
    const tempIL = this.cd.itemList;
    if (Array.isArray(tempIL)) {
      this.itemList = tempIL;
    } else {
      tempIL.subscribe((data: any[]) => (this.itemList = data));
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
}
