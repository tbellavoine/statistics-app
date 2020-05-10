import { Component, OnInit, ViewChild } from '@angular/core';
import { CoronaApiService } from '../../../api/corona-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators } from '@angular/forms';

export interface CountryElement {
  name: string;
  total_cases: string;
  recovered: string;
  deaths: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  total_cases:string;
  deaths: string;
  recovered: string;
  updated: string;
  countriesList : any;
  countriesData: CountryElement[] = [];
  displayedColumns: string[] = ['name', 'total_cases', 'recovered', 'death'];
  dataSource = new MatTableDataSource();

  countryForm = this.formBuilder.group({
    country: [null]
  });

  constructor(private _coronaApiService:CoronaApiService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._coronaApiService.getSummaryByCountries().subscribe((datas) =>{
      this.getUpdated(datas['Countries'][0]);
      this.getWorldSummary(datas['Global']);
      this.getCountriesSummary(datas['Countries']);
      console.log('covid19api: summary',datas['Countries']);
    })

    this._coronaApiService.getListOfCountries().subscribe((datas) =>{
      console.log('covid19api: countries',datas);
      
      this.countriesList = datas;
      this.countriesList.sort(this.dynamicSort("Country"));
      console.log('sorted',this.countriesList);
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getWorldSummary(datas:any){
    this.total_cases = this.addNumberSpaces(datas.TotalConfirmed);
    this.deaths = this.addNumberSpaces(datas.TotalDeaths);
    this.recovered = this.addNumberSpaces(datas.TotalRecovered);
  }

  getCountriesSummary(datas:any){
    datas.forEach(element => {
      const item:CountryElement = {
          name : element.Country,
          total_cases : element.TotalConfirmed,
          recovered : element.TotalRecovered,
          deaths : element.TotalDeaths
        }
        this.countriesData.push(item);
    });
    this.dataSource.data = this.countriesData;
  }

  getUpdated(data:any){
    console.log(data.Date);
    const date = new Date(data.Date);
    const dateoptions = {day: 'numeric', month: 'numeric', year: "numeric", hour:"numeric", minute:"numeric"};
    this.updated = date.toLocaleDateString('fr-FR',dateoptions);
  }

  addNumberSpaces(number:string){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
  }

  onCountryChange(value){
    console.log('Country changed...');

    this._coronaApiService.getLiveDatasOfCountries(value).subscribe((datas) => {
      console.log('covid19api: live country selected',datas);
    })
  }
}
