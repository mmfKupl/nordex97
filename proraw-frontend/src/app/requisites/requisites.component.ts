import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

class Requisite {
  name: string;
  text: string;
  isLink?: boolean;
  link?: string;
}

@Component({
  selector: 'app-requisites',
  templateUrl: './requisites.component.html',
  styleUrls: ['./requisites.component.scss']
})
export class RequisitesComponent implements OnInit {
  constructor(private dd: DeviceDetectorService) {}

  requisites: Requisite[] = [
    { name: 'ОГРН', text: '1166733073418' },
    { name: 'ОКПО', text: '05504099' },
    { name: 'ИНН/КПП', text: '6732135720 / 673201001' },
    {
      name: 'Юридический адрес',
      text: 'РФ, 214032, г.Смоленск, ул.Маршала Еременко, д.8Б, офис Р2'
    },
    {
      name: 'Фактический (почтовый) адрес',
      text: 'РФ, 109387, г.Москва, ул.Люблинская, д.42, офис 326-1'
    },
    {
      name: 'Контактный номер 1',
      text: '8 499 967-86-99',
      isLink: true,
      link: 'tel:84999678699'
    },
    {
      name: 'Контактный номер 2',
      text: '8 926 194-19-98',
      isLink: true,
      link: 'tel:89261941998'
    },
    {
      name: 'Email',
      text: 'nrd2019@mail.ru',
      isLink: true,
      link: 'mailto:nrd2019@mail.ru'
    }
  ];

  ngOnInit() {}

  get isMobileWidth() {
    return window.innerWidth <= 900;
  }

  get isMobile() {
    return this.dd.isMobile() || this.isMobileWidth;
  }
}
