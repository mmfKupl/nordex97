import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderStatusSource = new BehaviorSubject<boolean>(false);
  loaderStatus$ = this.loaderStatusSource.asObservable();

  constructor() {}

  setLoaderStatus(nexStatus: boolean = false) {
    this.loaderStatusSource.next(nexStatus);
  }
}
