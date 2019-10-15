import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogDataService } from '../catalog-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item } from '../item';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  items$: Observable<Item[]>;

  constructor(private route: ActivatedRoute, private cd: CatalogDataService) {}

  ngOnInit() {
    this.items$ = this.route.queryParamMap.pipe(
      map(data => data.get('query')),
      tap(d => console.log(d)),
      switchMap(query => this.cd.getSearchedData(query)),
      tap(d => console.log(d))
    );
  }
}
