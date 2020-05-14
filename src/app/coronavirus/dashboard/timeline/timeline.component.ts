import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input('datas') datas: any;
  options = {
    direction :'rtl'
  }
  constructor() { }

  ngOnInit(): void {
  }

}
