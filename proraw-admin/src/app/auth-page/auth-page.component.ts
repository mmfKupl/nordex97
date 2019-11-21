import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  login: string;
  password: string;

  constructor(private as: AuthService) {}

  ngOnInit() {}

  auth() {
    this.as.login(this.login, this.password);
  }
}
