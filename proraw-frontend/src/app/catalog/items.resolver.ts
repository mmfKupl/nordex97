import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Item } from './item';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { CatalogDataService } from './catalog-data.service';

@Injectable({ providedIn: 'root' })
export class ItemsResolver implements Resolve<Item[]> {
  constructor(private cd: CatalogDataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    console.log('itemresolver');
    return this.cd.getItemsByCategoryId(+route.paramMap.get('id'));
  }
}
