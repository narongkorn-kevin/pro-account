import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { Observable, map } from 'rxjs';

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent implements OnInit
{

    item$: Observable<any>;

    @Input() chat: Chat;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private itemService: ItemService,
    )
    {
    }

    ngOnInit(): void {
        this.item$ = this.itemService.getItemPage().pipe(
            map((resp: any) => {
                return resp.data.data
            })
        );
    }


}
