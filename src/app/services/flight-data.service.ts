import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightDataService {

  private searchDataSubject = new BehaviorSubject<any>(null);
  searchData$ = this.searchDataSubject.asObservable();

  constructor() {}

  updateSearchData(data: any) {
    this.searchDataSubject.next(data);
  }
}
