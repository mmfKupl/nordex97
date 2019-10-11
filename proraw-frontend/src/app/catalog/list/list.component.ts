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
  curExpandId: number;
  constructor(private cd: CatalogDataService) {}

  ngOnInit() {
    this.itemList = this.cd.itemList;
  }

  setCurExpand(i: number) {
    this.curExpandId = i;
  }

  setCurExpandToNull() {
    this.curExpandId = null;
  }

  getCurClass(expanId: number) {
    if (!expanId) {
      return false;
    }
    return expanId && this.curExpandId && expanId === this.curExpandId;
  }
}
