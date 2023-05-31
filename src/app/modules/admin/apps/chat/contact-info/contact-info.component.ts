import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { Observable, map } from 'rxjs';
import { AddProductComponent } from '../chats/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent implements OnInit
{

    selectedBank: string;
    banks: string[] = ['Kasikorn Bank', 'Bank of America', 'HSBC', 'Citibank'];
    images: any[] = [];


    handleFileInput(event: any): void {
      this.ngZone.run(() => {
        const files: FileList = event.target.files;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const file: File = files[i];
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
              const image = {
                url: e.target.result
              };
              this.images.push(image);
            };

            reader.readAsDataURL(file);
          }
        }
      });
    }

    rerender: any;
    item$: Observable<any>;

    @Input() chat: Chat;
    @Input() drawer: MatDrawer;
    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
      });
    /**
     * Constructor
     */
    constructor(
        private itemService: ItemService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private ngZone: NgZone

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
