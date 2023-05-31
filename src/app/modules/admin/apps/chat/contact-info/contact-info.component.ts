import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { Observable, map } from 'rxjs';
import { AddProductComponent } from '../chats/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent implements OnInit
{
    rerender: any;
    item$: Observable<any>;

    @Input() chat: Chat;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private itemService: ItemService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,

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
    New2() {
        const dialogRef = this._matDialog.open(AddProductComponent, {
            width: '900px',
            height: '750px'
        });

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }

}
