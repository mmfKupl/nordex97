import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../category';
import { Resolve } from '@angular/router';
import { CatalogDataService } from './catalog-data.service';

@Injectable({ providedIn: 'root' })
export class CategoryResolver implements Resolve<Observable<Category[]>> {
  constructor(private cd: CatalogDataService) {}

  resolve(): Observable<Category[]> {
    return this.cd.getСategories() as Observable<Category[]>;
  }
}
