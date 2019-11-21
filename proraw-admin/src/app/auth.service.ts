import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionKey: string;
  adminLogin: string;
  idAdmin: string;
  login$ = new BehaviorSubject<string>('');
  constructor(private http: HttpClient, private router: Router) {}

  checkAuth() {
    if (!this.sessionKey) {
      this.sessionKey = localStorage.getItem('sessionKey');
    }
    if (!this.idAdmin) {
      this.idAdmin = localStorage.getItem('idAdmin');
    }
    if (!this.adminLogin) {
      this.adminLogin = localStorage.getItem('adminLogin');
      this.login$.next(this.adminLogin);
    }
    return this.http
      .post('/validateAdmin', {
        idAdmin: this.idAdmin,
        sessionKey: this.sessionKey
      })
      .pipe(
        map((res: any) => {
          res = res[0];
          if (!res.Valid) {
            this.sessionKey = '';
            localStorage.setItem('sessionKey', this.sessionKey);
            this.adminLogin = '';
            localStorage.setItem('adminLogin', this.adminLogin);
            this.login$.next(this.adminLogin);
            this.idAdmin = '';
            localStorage.setItem('idAdmin', this.idAdmin);
          }
          return !!res.Valid;
        })
      );
  }

  login(login: string, password: string) {
    this.http
      .post('/login', { login, password })
      .pipe(map(res => res[0]))
      .subscribe(
        (res: any) => {
          if (res.IDAdmin === -1) {
            alert('Логин или пароль введен неверно!');
            return;
          }
          this.adminLogin = login;
          localStorage.setItem('adminLogin', this.adminLogin);
          this.login$.next(this.adminLogin);
          this.sessionKey = res.SessionKey;
          localStorage.setItem('sessionKey', this.sessionKey);
          this.idAdmin = res.IDAdmin;
          localStorage.setItem('idAdmin', this.idAdmin);
          this.router.navigateByUrl('');
        },
        err => console.log(err)
      );
  }

  logout() {
    this.http.post('/logout', { idAdmin: this.idAdmin }).subscribe(
      () => {
        this.sessionKey = '';
        localStorage.setItem('sessionKey', this.sessionKey);
        this.adminLogin = '';
        localStorage.setItem('adminLogin', this.adminLogin);
        this.login$.next(this.adminLogin);
        this.idAdmin = '';
        localStorage.setItem('idAdmin', this.idAdmin);
        this.router.navigateByUrl('/auth');
      },
      err => alert(err)
    );
  }
}
