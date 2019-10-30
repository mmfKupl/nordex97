import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { RequisitesComponent } from './requisites/requisites.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { DeliveryPageComponent } from './delivery-page/delivery-page.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ItemComponent,
    ItemListComponent,
    ItemCardComponent,
    BlockListComponent,
    ListComponent,
    SearchComponent,
    RequisitesComponent,
    AboutPageComponent,
    DeliveryPageComponent,
    MobileMenuComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    ScrollToModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
