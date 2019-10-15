import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { ListComponent } from './list/list.component';
import { ItemComponent } from './item/item.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    ListComponent,
    ItemComponent,
    CatalogComponent,
    BlockListComponent,
    ItemListComponent,
    ItemCardComponent,
    SearchComponent
  ],
  imports: [CommonModule, CatalogRoutingModule],
  exports: [ItemCardComponent]
})
export class CatalogModule {}
