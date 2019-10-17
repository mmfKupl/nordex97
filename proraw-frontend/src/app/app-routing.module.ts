import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { SearchComponent } from './search/search.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';
import { BlockListComponent } from './block-list/block-list.component';
import { RequisitesComponent } from './requisites/requisites.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },
  {
    path: 'requisites',
    component: RequisitesComponent
  },
  {
    path: 'catalog',
    children: [
      {
        path: 'search',
        component: SearchComponent
      },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
