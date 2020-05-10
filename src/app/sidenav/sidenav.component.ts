import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  openMenu : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu(){
    this.openMenu = !this.openMenu;
  }
}
