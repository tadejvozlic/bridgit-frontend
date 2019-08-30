import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/internal/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url = 'http://localhost:3000/api/';
  mq: Subject<any>;
  constructor(
    private http: HttpClient,
  ) { }

  postResults(matchID, moves): Observable<any> {
    return this.http.post(this.url + 'postResults', { id: matchID, moves })
    .pipe(
      map((res) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        return of(err);
      }),
    );
  }
  //Example: 
  // stop(exchange_name): Observable<any> {
  //   // this.body.set('exchange', exchange);
  //   return this.http
  //     .post(this.url + 'stop', { "exchange": exchange_name })
      // .pipe(
      //   map((res) => { //text, err, exchange_name, status:bool
      //     this.eventHandlerService.handleSuccess("Process succesfully stopped!");
      //     return res;
      //   }),
      //   catchError((err: HttpErrorResponse) => {
      //     this.eventHandlerService.handleError('Cannot stop service. Proccess might not be running');
      //     return of(err);
      //   }),
      // );
  // }
}
