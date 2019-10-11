import { Injectable } from '@angular/core';
import items from '../../assets/itemList.json';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  itemList: any[];

  constructor() {
    this.itemList = items;
  }

  getCurItem(pos: number) {
    return this.itemList[pos] || {};
  }
}
