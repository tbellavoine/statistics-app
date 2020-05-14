import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoronaApiService {

  country:string = 'usa';
  api_url:string = 'https://api.covid19api.com/';
  errorMsg:string;

  constructor(private httpClient:HttpClient) { 
    this.getAllDatas();
    this.getSummaryByCountries();
  }
  getAllDatas(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'all',{headers}).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }
  getLiveDatasOfCountries(country:string){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'total/country/'+country,{headers}).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

  getSummaryByCountries(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'summary',{headers}).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
