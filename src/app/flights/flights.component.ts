import { Component, OnInit, inject } from '@angular/core';
import { FlightDataService } from '../services/flight-data.service';
import { collection } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Flight } from '../../models/flight.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
})
export class FlightsComponent implements OnInit {
  flights: Flight[] = [];
  returnFlights: Flight[] = [];
  loading: boolean = true;
  info: any;
  sortBy: string[] = ['Time', 'Price', 'Duration'];
  selectedSortBy: string = 'time';
  noFlights: boolean = false;
  noReturnFlights: boolean = false;

  constructor(private flightDataService: FlightDataService) {}
  firestore = inject(Firestore);

  ngOnInit() {
    this.flightDataService.searchData$.subscribe((res) => {
      console.log(res);
      this.info = res;
    });

    this.getFlights();
  }

  getFlights() {
    this.loading = true;
    const flightsCollection = collection(this.firestore, 'flights');
    collectionData(flightsCollection).subscribe((res) => {
      res.forEach((element: any) => {
        if (
          element.date === this.info.departureDate &&
          element.departure === this.info.departure &&
          element.landing === this.info.landing
        ) {
          this.flights.push(element);
        }
        if (
          !this.info.isOneWay &&
          element.date === this.info.returnDate &&
          element.departure === this.info.landing &&
          element.landing === this.info.departure
        ) {
          this.returnFlights.push(element);
        }
      });
      if (this.flights.length === 0) {
        this.noFlights = true;
      } else this.noFlights = false;

      if (this.returnFlights.length === 0) {
        this.noReturnFlights = true;
      } else this.noReturnFlights = false;
      this.loading = false;
      this.sortFlights();
    });
  }

  sortFlights() {
    this.sorting(this.flights);
    this.sorting(this.returnFlights);
  }

  sorting(flights: Flight[]) {
    flights.sort((a, b) => {
      switch (this.selectedSortBy) {
        case 'Time':
          return a.time.localeCompare(b.time);
        case 'Price':
          return a.price - b.price;
        case 'Duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
  }
}
