import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor(private http: HttpClient, private as: AuthService) {}

  ngOnInit() {}

  onFileChange(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let path;
    if (type === 'categories') {
      path = '/uploadFileCategories';
    } else if (type === 'items') {
      path = '/uploadFileItems';
    } else {
      return;
    }
    path += `?idAdmin=${this.as.idAdmin}&sessionKey=${this.as.sessionKey}`;
    this.http.post(path, formData).subscribe(
      (res: any) => {
        try {
          const jsonD = JSON.parse(res);
          if (jsonD.status === 'Error') {
            alert(
              jsonD.message + '\nВозможно кто-то дургой вошел с этого же логина'
            );
            setTimeout(() => {
              this.as.logout();
            }, 1500);
            return;
          }
        } catch (err) {}
        console.log(res);
      },
      err => console.log(err)
    );
  }

  downloadFileCategories() {
    this.http
      .get(
        `/getFileCategories?idAdmin=${this.as.idAdmin}&sessionKey=${this.as.sessionKey}`,
        { responseType: 'text' }
      )
      .subscribe(
        (data: any) => {
          try {
            const jsonD = JSON.parse(data);
            if (jsonD.status === 'Error') {
              alert(
                jsonD.message +
                  '\nВозможно кто-то дургой вошел с этого же логина'
              );
              setTimeout(() => {
                this.as.logout();
              }, 1500);
              return;
            }
          } catch (err) {}
          this.downloadFile(data, 'categories.xml');
        },
        err => console.log(err)
      );
  }

  downloadFileItems() {
    this.http
      .get(
        `/getFileItems?idAdmin=${this.as.idAdmin}&sessionKey=${this.as.sessionKey}`,
        { responseType: 'text' }
      )
      .subscribe(
        (data: any) => {
          try {
            const jsonD = JSON.parse(data);
            if (jsonD.status === 'Error') {
              alert(
                jsonD.message +
                  '\nВозможно кто-то дургой вошел с этого же логина'
              );
              setTimeout(() => {
                this.as.logout();
              }, 1500);
              return;
            }
          } catch (err) {}

          this.downloadFile(data, 'items.xml');
        },
        err => console.log(err)
      );
  }

  downloadFile(fileString: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    const blob = new Blob([fileString], { type: 'application/xml' });
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

  checkStatus() {
    this.http.get('/getUploadingStatus').subscribe((data: any) => {
      const message = data.status ? 'В процессе' : 'Данные обработаны';
      alert(message);
    });
  }
}
