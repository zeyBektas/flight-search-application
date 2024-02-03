import { Component, OnInit, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { FlightDataService } from '../services/flight-data.service';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
  ],
})
export class SearchComponent implements OnInit {
  departure = new FormControl('');
  landing = new FormControl('');
  options: string[] = [];
  filteredOptions1: Observable<string[]> | undefined;
  filteredOptions2: Observable<string[]> | undefined;
  isOneWay: boolean = false;
  todayDate = new Date();
  departureDate = new Date();
  returnDate: any;
  showErrorMessage: boolean = false;

  constructor(
    private router: Router,
    private flightDataService: FlightDataService
  ) {}

  firestore = inject(Firestore);

  ngOnInit() {
    this.getAirports();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  searchFlights() {
    const searchData = {
      departure: this.departure.value,
      landing: this.landing.value,
      departureDate: this.formatDate(this.departureDate),
      returnDate: this.formatDate(this.returnDate),
      isOneWay: this.isOneWay,
    };
    if (
      searchData.departure &&
      searchData.landing &&
      searchData.departureDate
    ) {
      if (this.isOneWay || searchData.returnDate) {
        this.flightDataService.updateSearchData(searchData);
        this.router.navigateByUrl('flights');
      } else this.showErrorMessage = true;
    } else this.showErrorMessage = true;
  }

  getAirports() {
    if (this.options.length !== 0) {
      return;
    }

    const airportsCollection = collection(this.firestore, 'airports');
    collectionData(airportsCollection).subscribe((res) => {
      res.forEach((element: any) => {
        const option = element.city + ' (' + element.airportCode + ')';
        this.options.push(option);
      });

      this.filteredOptions1 = this.departure.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );

      this.filteredOptions2 = this.landing.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });
  }

  formatToTwoDigits(num: number) {
    let twoDigit: string;
    if (num < 10) {
      twoDigit = '0' + num;
    } else {
      twoDigit = num.toString();
    }
    return twoDigit;
  }

  formatDate(date: Date) {
    if (date === undefined) {
      return;
    }
    let time: string =
      date.getFullYear() +
      '-' +
      this.formatToTwoDigits(date.getMonth() + 1) +
      '-' +
      this.formatToTwoDigits(date.getDate());
    return time;
  }
}
