import { Route } from '@angular/router';
import { ChatChatResolver, ChatChatsResolver, ChatContactsResolver, ChatProfileResolver } from 'app/modules/admin/g-admin/chat/chat.resolvers';
import { ChatComponent } from 'app/modules/admin/g-admin/chat/chat.component';
import { ChatsComponent } from 'app/modules/admin/g-admin/chat/chats/chats.component';
import { ConversationComponent } from 'app/modules/admin/g-admin/chat/conversation/conversation.component';

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
                path     : 'list',
                component: ChatsComponent,
                children : [
                    {
                        path     : 'data',
                        component: ConversationComponent,
                        resolve: {
                            conversation: ChatChatResolver
                        }
                    }
                ]
            }
        ]
    }
];
