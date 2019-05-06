import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url: string = 'http://localhost:80/';
  constructor(
    private http: HttpClient
  ) { }

  newGame() {
    this.http.post(this.url + 'newGame', 'test');
  }
  joinGame() {
    return this.http.get(this.url + 'pendingGames');
  }
  // postResults():Observable<any> {
    // this.http.post(this.url, results);
  //   return true;
  // }
}
