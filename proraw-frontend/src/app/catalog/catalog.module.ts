import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { ListComponent } from './list/list.component';
import { ItemComponent } from './item/item.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BlockListComponent } from './block-list/block-list.component';

@NgModule({
  declarations: [
    ListComponent,
    ItemComponent,
    CatalogComponent,
    BlockListComponent
  ],
  imports: [CommonModule, CatalogRoutingModule]
})
export class CatalogModule {}
