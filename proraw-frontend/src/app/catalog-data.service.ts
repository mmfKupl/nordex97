import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './item';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { Category } from './category';

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
      map(data => {
        const maped: Category[] = [];
        for (const el of data) {
          if (el.Expand) {
            const eidel = maped.find(mel => mel.ExpandId === el.Expand);
            if (Array.isArray(eidel.Subs)) {
              eidel.Subs.push(el);
            } else {
              eidel.Subs = [el];
            }
          } else {
            maped.push(el);
          }
        }
        return maped;
      }),
      tap(data => {
        this.categories = data;
      })
    );
  }

  getCurrentCategory(categoryId: number): Observable<Category> {
    return this.getСategories().pipe(
      map(cats => this.flatCategories(cats)),
      map(cats => cats.find(cat => cat.IDCategory === categoryId))
    );
  }

  private flatCategories(array: Category[]): Category[] {
    return array.reduce((ac, cur) => {
      if (!cur.Subs) {
        ac.push(cur);
      } else {
        const subs = cur.Subs;
        ac.push(cur, ...subs);
      }
      return ac;
    }, []);
  }

  getItemsByCategoryId(categoryId: number): Observable<Item[]> {
    // return this.httpClient.get(`http://localhost:4000/api/items/${num}`).pipe(
    //   catchError(err => {
    //     console.log(err.message);
    //     return [];
    //   })
    // );
    console.log(categoryId);
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
        console.log(items);
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