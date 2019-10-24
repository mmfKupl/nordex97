import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { BlockListComponent } from './block-list/block-list.component';
import { ListComponent } from './list/list.component';
import { SearchComponent } from './search/search.component';
import { CatalogComponent } from './catalog/catalog.component';
import { RequisitesComponent } from './requisites/requisites.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { DeliveryPageComponent } from './delivery-page/delivery-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CatalogComponent,
    ItemComponent,
    ItemListComponent,
    ItemCardComponent,
    BlockListComponent,
    ListComponent,
    SearchComponent,
    RequisitesComponent,
    AboutPageComponent,
    DeliveryPageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
