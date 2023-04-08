import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
<<<<<<< HEAD
import { Chat } from 'app/modules/admin/g-admin/chat/chat.types';
=======
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
>>>>>>> 1f6064cb32c630f9775246543626c9ddfda31647

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent
{
    @Input() chat: Chat;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor()
    {
    }
}
