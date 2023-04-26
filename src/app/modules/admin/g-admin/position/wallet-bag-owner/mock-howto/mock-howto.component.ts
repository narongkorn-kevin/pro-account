import { Component, OnInit } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './heroes';

@Component({
  selector: 'app-mock-howto',
  templateUrl: './mock-howto.component.html',
  styleUrls: ['./mock-howto.component.scss']
})
export class MockHowtoComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  heroes = HEROES;
  selectedHero?: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
