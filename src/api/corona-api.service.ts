import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoronaApiService {

  country:string = 'usa';
  api_url:string = 'https://api.covid19api.com/';

  constructor(private httpClient:HttpClient) { 
    this.getAllDatas();
    this.getSummaryByCountries();
  }
  getAllDatas(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    this.httpClient
      .get(this.api_url+'all',{headers})
      .subscribe((datas) =>{
        console.log('covid19api: all',datas);
      })
  }
  getListOfCountries(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'countries',{headers})
  }
  getLiveDatasOfCountries(country:string){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'total/country/'+country,{headers})
  }

  getSummaryByCountries(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Origin", "*");
    return this.httpClient
      .get(this.api_url+'summary',{headers})
  }
}
