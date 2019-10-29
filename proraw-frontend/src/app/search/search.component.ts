import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogDataService } from '../catalog-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  items$: Observable<Item[]>;

  constructor(
    private route: ActivatedRoute,
    private cd: CatalogDataService,
    private dd: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.items$ = this.route.queryParamMap.pipe(
      map(data => data.get('query')),
      switchMap(query => this.cd.getSearchedData(query))
    );
  }

  get isMobile() {
    return this.dd.isMobile();
  }
}
