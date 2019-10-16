import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './item';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../category';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  constructor(private httpClient: HttpClient) {}

  getСategories(): Observable<Category[]> {
    // return this.httpClient.get('http://localhost:4000/api/categories').pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    return this.httpClient.get<Category[]>('api/categories');
  }

  getItemsByCategoryId(num: number): Observable<Item[]> {
    // return this.httpClient.get(`http://localhost:4000/api/items/${num}`).pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    return this.httpClient.get<Item[]>(`api/items`).pipe(
      map(items => {
        return items.filter(item => {
          return item.IDCategory === num;
        });
      }),
      catchError(err => [])
    );
  }

  getItemByIdAndCategoryId(
    itemId: number,
    categoryId: number
  ): Observable<Item> {
    return this.getItemsByCategoryId(categoryId).pipe(
      map(items => items.find(item => item.IDItem === itemId))
    );
  }

  getSearchedData(str: string): Observable<Item[]> {
    // return this.httpClient.get(`http://localhost:4000/api/search/${str}`).pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    return this.httpClient.get<Item[]>('api/items').pipe(
      map(items => {
        return items.filter(item => {
          return item.VendorCode.toString().includes(str);
        });
      }),
      catchError(err => [])
    );
  }
}
