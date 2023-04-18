import { Component } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-bank';

@Component({
  selector: 'app-select-bank',
  templateUrl: './select-bank.component.html',
  styleUrls: ['./select-bank.component.scss']
})
export class SelectBankComponent{

  heroes = HEROES;
  selectedHero?: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}