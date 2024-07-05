import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Target } from '../target';

@Injectable({
  providedIn: 'root'
})
export class StreamServiceService {
  private baseUrl = 'https://api.airsafe.spire.com/v2/';
  private apiUrl = 'https://opensky-network.org/api/states/all';

  constructor(private http: HttpClient) {}

   getStreamData(): Observable<Target[]> {
    const url = `${this.baseUrl}targets/stream`;
    const headers = new HttpHeaders({
      Authorization: 'Bearer tHkcJG5CGq3VzgTjcApGNE5ZB0YNvE6b',
    });
    const params = new HttpParams().set('compression', 'none');

    return this.http.get<any[]>(url, { headers, params }).pipe(
      map(response => response.map(item => item.target as Target))
    );
  }
  getFlights(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
