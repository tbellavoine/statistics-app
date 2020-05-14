import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CoronaApiService } from '../../../api/corona-api.service';
import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
// import mapWorld  from  '@highcharts/map-collection/custom/world.geo.json';
declare var require: any
const mapWorld = require('@highcharts/map-collection/custom/world.geo.json');

MapModule(Highcharts);

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.scss']
})
export class WorldmapComponent implements OnInit {

   defaultState : string = 'Confirmed';
   updated: string;
   isLoading : boolean = true;
   highcharts = Highcharts;
   updateChart: boolean = false;
   serieName: string;
   axisX: any[] = []

   chartMap: Highcharts.Options = {
      chart: {
        map: mapWorld
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      mapNavigation: {
         enabled: false,
         buttonOptions: {
            alignTo: 'spacingBox'
         }
      },
      legend: {
         enabled: true,
         layout: 'vertical',
         align: 'left',
         verticalAlign: 'bottom'
      },
      colorAxis: {
         min: 0,
         stops: [
             [0, 'rgba(0,0,0,0)'],
             [0.5, 'rgba(0,0,0,0.5)'],
             [1, 'rgba(0,0,0,1)']
         ]
      },
      series: [{
        name: 'Random data',
        states: {
          hover: {
            color: '#feb960'
          }
        },
        allAreas: true,
        data: this.axisX
      } as Highcharts.SeriesMapOptions]
    };
  
  constructor(private _coronaApiService:CoronaApiService) { }

  ngOnInit(){
   this._coronaApiService.getSummaryByCountries().subscribe((datas) =>{
      this.isLoading = true;
      this.getUpdated(datas['Date']);
      this.getCountriesSummary(datas['Countries'], this.defaultState);
    })
  }

  ngOnChanges(changes: SimpleChanges){  
   this.chartMap.series[0]['data'] = changes.axisX;
   console.log('changes.axisX',changes.axisX);
   this.updateChart = true;
  }

  getUpdated(data:any){
   const date = new Date(data);
   const dateoptions = {day: 'numeric', month: 'numeric', year: "numeric", hour:"numeric", minute:"numeric"};
   this.updated = date.toLocaleDateString('fr-FR',dateoptions);
   this.isLoading = false;
}

 getCountriesSummary(datas:any, status){
   this.axisX = [];
   datas.forEach(element => {
      if(status == 'Confirmed'){
         this.axisX.push({'hc-key' : element.CountryCode.trim().toLowerCase() , 'value' : element.TotalConfirmed});
         this.chartMap.colorAxis['stops'] = [
            [0, 'rgba(255,179,71,0.1)'],
            [0.01, 'rgba(255,179,71,0.5)'],
            [0.5, 'rgba(255,179,71,0.8)'],
            [1, 'rgba(255,179,71,1)']
        ]
        this.chartMap.series[0]['states'].hover.color = '#FFB347';
        this.chartMap.series[0]['name'] = "Nombre de cas confirmés";
      }
      if(status == 'Recovered'){
         this.axisX.push({'hc-key' : element.CountryCode.trim().toLowerCase() , 'value' : element.TotalRecovered});
         this.chartMap.colorAxis['stops'] = [
            [0, 'rgba(196,245,200,0.1)'],
            [0.01, 'rgba(196,245,200,0.5)'],
            [0.5, 'rgba(196,245,200,0.8)'],
            [1, 'rgba(196,245,200,1)']
        ]
        this.chartMap.series[0]['states'].hover.color = '#B0F2B6';
        this.chartMap.series[0]['name'] = "Nombre de cas rétablis";
      }
      if(status == 'Deaths'){
         this.axisX.push({'hc-key' : element.CountryCode.trim().toLowerCase() , 'value' : element.TotalDeaths});
         this.chartMap.colorAxis['stops'] = [
            [0, 'rgba(196,57,36,0.1)'],
            [0.01, 'rgba(196,57,36,0.5)'],
            [0.5, 'rgba(196,57,36,0.8)'],
            [1, 'rgba(196,57,36,1)']
        ]
        this.chartMap.series[0]['states'].hover.color = '#C43924';
        this.chartMap.series[0]['name'] = "Nombre de cas décédés";
      }
   });
  
   this.chartMap.series[0]['data'] = this.axisX;
   this.updateChart = true;
 }

 onStateChange(value){
   console.log('Country changed...');
   this.isLoading = true;
   this._coronaApiService.getSummaryByCountries().subscribe((datas) =>{
      this.getCountriesSummary(datas['Countries'], value);
      this.isLoading = false;
    })
 }

}
