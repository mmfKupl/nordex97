import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemList } from './item-list';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  itemList$: Observable<any>;
  private itemListData: any;

  constructor(private httpClient: HttpClient) {
    this.itemList$ = this.httpClient
      .get('../../assets/itemList.json')
      .pipe(data => {
        this.itemListData = data;
        return data;
      });
  }

  get itemList(): any[] | Observable<any> {
    if (this.itemListData) {
      return this.itemListData;
    }
    return this.itemList$;
  }

  getCurItemList(num: number): Observable<ItemList[]> {
    const path = `../../assets/items/${num}.json`;
    return this.httpClient
      .get(path)
      .pipe(catchError(() => of([] as ItemList[]))) as Observable<ItemList[]>;
  }
}
