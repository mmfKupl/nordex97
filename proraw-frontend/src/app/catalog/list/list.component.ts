import { Component, OnInit } from '@angular/core';
import { CatalogDataService } from '../catalog-data.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  itemList: string[];
  constructor(private cd: CatalogDataService) {}

  ngOnInit() {
    this.itemList = this.cd.itemList;
  }
}
