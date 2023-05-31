import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { chatRoutes } from 'app/modules/admin/apps/chat/chat.routing';
import { ChatComponent } from 'app/modules/admin/apps/chat/chat.component';
import { ChatsComponent } from 'app/modules/admin/apps/chat/chats/chats.component';
import { ContactInfoComponent } from 'app/modules/admin/apps/chat/contact-info/contact-info.component';
import { EmptyConversationComponent } from 'app/modules/admin/apps/chat/empty-conversation/empty-conversation.component';
import { ConversationComponent } from 'app/modules/admin/apps/chat/conversation/conversation.component';
import { NewChatComponent } from 'app/modules/admin/apps/chat/new-chat/new-chat.component';
import { ProfileComponent } from 'app/modules/admin/apps/chat/profile/profile.component';
import { FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './chats/add-product/add-product.component';
@NgModule({
    declarations: [
        ChatComponent,
        ChatsComponent,
        ContactInfoComponent,
        ConversationComponent,
        EmptyConversationComponent,
        NewChatComponent,
        ProfileComponent,
        AddProductComponent
    ],
    imports     : [
        RouterModule.forChild(chatRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule,
        MatStepperModule,
        MatDialogModule,
        FormsModule,
    ],
    providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [

              {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('170313182614211')
              }
            ],
            onError: (err) => {
              console.error(err);
            }
          } as SocialAuthServiceConfig,
        }
      ],
  })
export class ChatModule
{
}
