import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogModule } from './catalog/catalog.module';
import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CatalogModule,
    AppRoutingModule,
    HttpClientModule
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
    //   dataEncapsulation: false
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
