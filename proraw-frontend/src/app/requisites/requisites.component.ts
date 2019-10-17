import { Component, OnInit } from '@angular/core';

class Requisite {
  name: string;
  info: string;
}

@Component({
  selector: 'app-requisites',
  templateUrl: './requisites.component.html',
  styleUrls: ['./requisites.component.css']
})
export class RequisitesComponent implements OnInit {
  constructor() {}

  requisites: Requisite[] = [
    { name: 'ОГРН', info: '1166733073418' },
    { name: 'ОКПО', info: '05504099' },
    { name: 'ИНН/КПП', info: '6732135720 / 673201001' },
    {
      name: 'Юридический адрес',
      info: 'РФ, 214032, г.Смоленск, ул.Маршала Еременко, д.8Б, офис Р2'
    },
    {
      name: 'Фактический (почтовый) адрес',
      info: 'РФ, 109387, г.Москва, ул.Люблинская, д.42, офис 326-1'
    },
    { name: 'Контактный номер', info: '8-499-967-86-99' }
  ];

  ngOnInit() {}
}
