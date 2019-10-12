import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ItemList } from './item-list';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  itemList$: Observable<any>;
  private itemListData: any;
  private itemLists: { [key: string]: ItemList[] | object } = {};

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

  getCurItemList(num: number): Observable<ItemList[] | object> {
    if (this.itemLists[num]) {
      return of(this.itemLists[num]);
    }
    const path = `../../assets/items/${num}.json`;
    return this.httpClient.get(path).pipe(
      catchError(() => of([] as ItemList[])),
      map(value => {
        this.itemLists[num] = value;
        return value;
      })
    ) as Observable<ItemList[]>;
  }

  getCurItem(listNum: number, num: number): Observable<ItemList> {
    if (this.itemLists[listNum]) {
      return of(this.itemLists[listNum][num]);
    }
    return this.getCurItemList(listNum).pipe(
      map(value => {
        return (value[num] || {}) as ItemList;
      })
    );
  }
}
