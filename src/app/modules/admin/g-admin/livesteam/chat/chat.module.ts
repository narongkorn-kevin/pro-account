import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
    {
        path     : '',
        component: ChatComponent
    }
];


@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class ChatModule { }
