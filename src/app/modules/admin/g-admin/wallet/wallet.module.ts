import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { walletRoute } from './wallet.routing';
import { WalletComponent } from './wallet.component';
import { WalletListComponent } from './wallet-list/wallet-list.component';
import { TopUpWalletComponent } from './top-up-wallet/top-up-wallet.component';



@NgModule({
  declarations: [
    WalletComponent,
    WalletListComponent,
    TopUpWalletComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(walletRoute)
  ]
})
export class WalletModule { }

