import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  login$: Observable<string>;
  constructor(private as: AuthService) {}

  ngOnInit() {
    this.login$ = this.as.login$;
  }

  logout() {
    this.as.logout();
  }
}
