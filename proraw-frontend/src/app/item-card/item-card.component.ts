import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input() itemTitle: string;
  @Input() itemAvailable: boolean;
  @Input() itemVendorCode: string;
  @Input() itemId: number;
  @Input() itemCategoryId: number;

  linkStr: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.linkStr = `catalog/${this.itemCategoryId}/${this.itemId}`;
  }

  routeTo() {
    this.router.navigateByUrl(`catalog/${this.itemCategoryId}/${this.itemId}`);
  }
}