import { Component, OnInit, inject } from '@angular/core';
import { FlightDataService } from '../services/flight-data.service';
import { collection } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Flight, FlightArray } from '../../models/flight.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent implements OnInit {

  flights: any[] = [];
  loading: boolean = true;
  info: any;
  
  constructor(private flightDataService: FlightDataService) {}
  firestore = inject(Firestore);

  ngOnInit() {
    this.flightDataService.searchData$.subscribe((res) => {
      console.log(res);
      this.info = res;
    })
    
    this.getFlights();
  }

  getFlights() {
    this.loading = true;
    const flightsCollection = collection(this.firestore, "flights");
    collectionData(flightsCollection).subscribe((res) => {
      console.log(res);
      res.forEach((element:any) => {
        console.log(this.info);

        if(element.date === this.info.departureDate && element.departure === this.info.departure) {
          this.flights.push(element);
        }
      });
      this.loading = false;
    })
  }

}
