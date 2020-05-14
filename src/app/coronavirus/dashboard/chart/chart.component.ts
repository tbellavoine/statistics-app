import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  highcharts = Highcharts;
  @Input('serie1') confirmed: any;
  @Input('serie2') recovered: any;
  @Input('serie3') deaths: any;
  @Input('axisX') axisX: any;
  @Input('width') width: any;
  @Input('type') type: any;
  updateChart: boolean = false;

  chartOptions = {   
      chart: {
         type: "area",
         width : 500,
         height: 500,
         zoomType: 'x'
      },
      plotOptions: {
         line: {
            marker: {
               enabled: false,
               symbol: 'circle',
               radius: 2,
               states: {
                  hover: {
                     enabled: true
                  }
               }
            }
         }
      },
      title: {
         text: ""
      },
      loading: true,
      xAxis:{
         categories:[]
      },
      yAxis: {          
         title:{
            text:""
         } 
      },
      series: [
         {
            name: 'Confirmés',
            data: [],
            color: '#FFB347'
         },
         {
            name: 'Rétablis',
            data: [],
            color: '#B0F2B6'
         },
         {
            name: 'Décédés',
            data: [],
            color: '#C43924'
         }
      ]
  };


  constructor() { }

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges){  
   this.chartOptions.series[0]['data'] = changes.confirmed.currentValue;
   this.chartOptions.series[1]['data'] = changes.recovered.currentValue;
   this.chartOptions.series[2]['data'] = changes.deaths.currentValue;
   this.chartOptions.xAxis.categories = changes.axisX.currentValue;
   this.chartOptions.chart.width = this.width;
   this.chartOptions.chart.type = this.type;
   this.updateChart = true;
  }

}
