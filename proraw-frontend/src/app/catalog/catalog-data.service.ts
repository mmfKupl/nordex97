import { Injectable } from '@angular/core';
import items from '../../assets/itemList.json';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  itemList: string[];

  constructor() {
    this.itemList = items;
  }
}
