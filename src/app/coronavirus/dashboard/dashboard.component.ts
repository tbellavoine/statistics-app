import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoronaApiService } from '../../../api/corona-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators } from '@angular/forms';

export interface CountryElement {
  name: string;
  total_cases: string;
  new_cases : string;
  recovered: string;
  new_recovered: string;
  deaths: string;
  new_deaths: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('blockContent') blockContent: ElementRef;
  
  defaultCountry: string = "world";
  total_cases:string;
  deaths: string;
  recovered: string;
  updated: string;
  countryName: string = 'france'
  countriesList = [];
  countriesData: CountryElement[] = [];
  displayedColumns: string[] = ['name', 'total_cases', 'recovered', 'death'];
  dataSource = new MatTableDataSource();
  chartType : string = 'line';
  timelineDatas : any;
  chartAxisX : string[] = [];
  chartConfirmed : string[] = [];
  chartRecovered : string[] = [];
  chartDeaths : string[] = [];
  chartWidth : string;
  updateChart : boolean = false;

  isLoading : boolean = true;

  countryForm = this.formBuilder.group({
    country: [null]
  });

  constructor(private _coronaApiService:CoronaApiService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._coronaApiService.getSummaryByCountries().subscribe((datas) =>{
      this.getUpdated(datas['Date']);
      this.getWorldSummary(datas['Global']);
      this.getCountriesSummary(datas['Countries']);
    })

    this._coronaApiService.getAllDatas().subscribe((datas) =>{
        this.isLoading = true;
        this.buildWorldValuesArray(datas);      
    })
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngAfterViewInit() {
    this.chartWidth = this.blockContent.nativeElement.clientWidth;
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
          new_cases : element.NewConfirmed,
          recovered : element.TotalRecovered,
          new_recovered : element.NewRecovered,
          deaths : element.TotalDeaths,
          new_deaths : element.NewDeaths,
        }
        this.countriesData.push(item);
    });
    this.dataSource.data = this.countriesData;
  }

  getUpdated(data:any){
    const date = new Date(data);
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
    this.isLoading = true;
    if (value !== "world"){
      this._coronaApiService.getLiveDatasOfCountries(value).subscribe((datas) => {
        this.timelineDatas = datas;
        this.buildDatesArray(datas);
        this.buildValuesArray(datas);
      })
    }else{
      this._coronaApiService.getAllDatas().subscribe((datas) =>{
        this.buildWorldValuesArray(datas);        
      })
    }
  }


  buildDatesArray(datas){
    const dates = [];

    datas.forEach(element => {
      const date = new Date(element.Date);
      const dateoptions = {day: 'numeric', month: 'short'};
      let dateString = date.toLocaleDateString('fr-FR',dateoptions);
      dates.push(dateString);
    });
    this.chartAxisX = dates;
  }

  buildValuesArray(datas){
    const Confirmed = [];
    const Recovered = [];
    const Deaths = [];

    datas.forEach(element => {
      Confirmed.push(element.Confirmed);
      Recovered.push(element.Recovered);
      Deaths.push(element.Deaths);
    })

    this.chartConfirmed = Confirmed;
    this.chartRecovered = Recovered;
    this.chartDeaths = Deaths;
    this.isLoading = false;
  }

  buildWorldValuesArray(datas){
    const dates = [];
    const Confirmed = [];
    const Recovered = [];
    const Deaths = [];
    const Countries = [{'Country': 'World', 'Slug': 'world' }];
    
    const tempdates = [];
    const temptimeline = [];
    let tempconfirmed = {};
    let temprecovered = {};
    let tempdeaths = {};
    
    let currentCountry = "";
    

    datas.forEach(element => {
      
      if (!tempdates.includes(element.Date)){
        tempdates.push(element.Date);
      }

      if(currentCountry !== element.Country){
        let name = element.Country;
        if (name == "United States of America"){name = "united-states"}
        else if (name == "Brunei Darussalam"){name = "brunei"}
        else if (name == "Côte d'Ivoire"){name = "cote-divoire"}
        else if (name == "Macedonia, Republic of"){name = "macedonia"}
        else if (name == "Republic of Kosovo"){name = "kosovo"}
        else if (name == "Saint Vincent and Grenadines"){name = "saint-vincent-and-the-grenadines"}
        else if (name == "Taiwan, Republic of China"){name = "taiwan"}
        else if (name == "Tanzania, United Republic of"){name = "tanzania"}

        let slug = name.trim().toLowerCase().replace(/ /g, "-")
        Countries.push({'Country': element.Country, 'Slug': slug });
        currentCountry = element.Country;
      }

      tempconfirmed[element.Date] = tempconfirmed[element.Date] ? tempconfirmed[element.Date] + element.Confirmed : element.Confirmed;
      temprecovered[element.Date] = temprecovered[element.Date] ? temprecovered[element.Date] + element.Recovered : element.Recovered;
      tempdeaths[element.Date] = tempdeaths[element.Date] ? tempdeaths[element.Date] + element.Deaths : element.Deaths;
      
    });
    let indexConfirmed = 0;
    let indexRecovered = 0;
    let indexDeaths = 0;
     
    tempdates.forEach(element => {
      const date = new Date(element);
      const dateoptions = {day: 'numeric', month: 'short'};
      let dateString = date.toLocaleDateString('fr-FR',dateoptions);
      dates.push(dateString);
      temptimeline.push({'Date' : element, 'Confirmed' : '', 'Recovered' : '', 'Deaths' : '' });
    });

    Object.values(tempconfirmed).forEach((element) => {
      Confirmed.push(element);
      if(temptimeline[indexConfirmed]){
        temptimeline[indexConfirmed]['Confirmed'] = element;
        indexConfirmed ++;
      }
      
    })
    Object.values(temprecovered).forEach((element) => {
      Recovered.push(element);
      if(temptimeline[indexRecovered]){
        temptimeline[indexRecovered].Recovered = element;
        indexRecovered ++;
      }
    })
    Object.values(tempdeaths).forEach((element) => {
      Deaths.push(element);
      if(temptimeline[indexDeaths]){
        temptimeline[indexDeaths].Deaths = element;
        indexDeaths ++;
      }
    })
    
    this.chartConfirmed = Confirmed;
    this.chartRecovered = Recovered;
    this.chartDeaths = Deaths;
    this.chartAxisX = dates;
    this.timelineDatas = temptimeline;
    this.countriesList = Countries;
   
    this.isLoading = false;
  }

  fetchRoute(route){
    this.router.navigate([route], {relativeTo: this.route});
  }
}
