import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input() itemTitle: string;
  @Input() itemAvailable: boolean;
  @Input() itemVendorCode: string;
  @Input() itemLink: number;

  constructor() {}

  ngOnInit() {}
}
