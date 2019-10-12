import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  getCurItem(pos: number) {
    return (this.itemListData && this.itemListData[pos]) || {};
  }

  getCurItemList(num: number) {
    const path = `../../assets/items/${num}.json`;
    return this.httpClient.get(path).pipe(catchError(err => of([])));
  }
}
