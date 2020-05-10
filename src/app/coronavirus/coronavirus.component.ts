import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from '../../animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.component.html',
  styleUrls: ['./coronavirus.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class CoronavirusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
