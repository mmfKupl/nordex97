import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ItemListComponent } from './item-list/item-list.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [
      {
        path: ':id',
        component: ItemListComponent
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
