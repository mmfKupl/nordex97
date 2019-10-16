import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './item';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { Category } from '../category';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  private categories: Category[];
  private items: { [key: string]: Item[] } = {};

  constructor(private httpClient: HttpClient) {}

  getСategories(): Observable<Category[]> {
    // return this.httpClient.get('http://localhost:4000/api/categories').pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    if (Array.isArray(this.categories)) {
      return of(this.categories);
    }
    return this.httpClient.get<Category[]>('api/categories').pipe(
      tap(data => {
        this.categories = data;
      })
    );
  }

  getCurrentCategoryTitle(categoryId: number): string {
    return this.categories
      ? this.categories.find(c => c.IDCategory === categoryId).Title
      : '';
  }

  getCurrentItemTitle(categoryId: number, itemId: number): string {
    if (!Array.isArray(this.categories) || !this.items) {
      return '';
    }
    const itemsByCategory = this.items[categoryId];
    if (!(itemsByCategory && itemsByCategory.length)) {
      return '';
    }

    const curItem = itemsByCategory.find(item => item.IDItem === itemId);

    if (!curItem) {
      return '';
    }

    return curItem.Title;
  }

  getItemsByCategoryId(categoryId: number): Observable<Item[]> {
    // return this.httpClient.get(`http://localhost:4000/api/items/${num}`).pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    if (this.items && this.items[categoryId] && this.items[categoryId].length) {
      return of(this.items[categoryId]);
    }
    return this.httpClient.get<Item[]>(`api/items`).pipe(
      map(items => {
        return items.filter(item => {
          return item.IDCategory === categoryId;
        });
      }),
      tap(items => {
        this.items[categoryId] = items;
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
