import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbPageComponent } from './fb-page.component';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [
    FbPageComponent,
    ListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FbPageModule { }
