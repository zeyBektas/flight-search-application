export interface Flight {
  airline: string;
  date: string;
  departure: string;
  duration: number;
  flightId: string;
  landing: string;
  price: number;
  time: string;
}

export interface FlightArray extends Array<Flight> {}
