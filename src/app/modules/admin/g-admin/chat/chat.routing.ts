import { Route } from '@angular/router';
<<<<<<< HEAD
import { ChatChatResolver, ChatChatsResolver, ChatContactsResolver, ChatProfileResolver } from 'app/modules/admin/g-admin/chat/chat.resolvers';
import { ChatComponent } from 'app/modules/admin/g-admin/chat/chat.component';
import { ChatsComponent } from 'app/modules/admin/g-admin/chat/chats/chats.component';
import { ConversationComponent } from 'app/modules/admin/g-admin/chat/conversation/conversation.component';
=======
import { ChatChatResolver, ChatChatsResolver, ChatContactsResolver, ChatProfileResolver } from 'app/modules/admin/apps/chat/chat.resolvers';
import { ChatComponent } from 'app/modules/admin/apps/chat/chat.component';
import { ChatsComponent } from 'app/modules/admin/apps/chat/chats/chats.component';
import { ConversationComponent } from 'app/modules/admin/apps/chat/conversation/conversation.component';
import { EmptyConversationComponent } from 'app/modules/admin/apps/chat/empty-conversation/empty-conversation.component';
>>>>>>> 1f6064cb32c630f9775246543626c9ddfda31647

export const chatRoutes: Route[] = [
    {
        path     : '',
        component: ChatComponent,
        resolve  : {
            chats   : ChatChatsResolver,
            contacts: ChatContactsResolver,
            profile : ChatProfileResolver
        },
        children : [
            {
<<<<<<< HEAD
                path     : 'list',
                component: ChatsComponent,
                children : [
                    {
                        path     : 'data',
                        component: ConversationComponent,
                        resolve: {
=======
                path     : '',
                component: ChatsComponent,
                children : [
                    {
                        path     : '',
                        pathMatch: 'full',
                        component: EmptyConversationComponent
                    },
                    {
                        path     : ':id',
                        component: ConversationComponent,
                        resolve  : {
>>>>>>> 1f6064cb32c630f9775246543626c9ddfda31647
                            conversation: ChatChatResolver
                        }
                    }
                ]
            }
        ]
    }
];
