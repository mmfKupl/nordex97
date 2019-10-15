import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { SearchComponent } from './search/search.component';
import { CategoryResolver } from './catefory.resolver';
import { ItemsResolver } from './items.resolver';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    resolve: {
      categories: CategoryResolver
    },
    children: [
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: ':id',
        component: ItemListComponent,
        resolve: {
          items: ItemsResolver
        }
      },
      {
        path: ':id/:id',
        component: ItemComponent
      },
      {
        path: '**',
        component: BlockListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {}
