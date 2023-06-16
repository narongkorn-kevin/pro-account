import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';

@Component({
    selector: 'fuse-confirmation-dialog',
    templateUrl: './dialog.component.html',
    styles: [
        /* language=SCSS */
        `
            .fuse-confirmation-dialog-panel {
                
                @screen md {
                    @apply w-128;
                }

                .mat-dialog-container {
                    padding: 0 !important;
                    
                }
            }

            :host::ng-deep  .mat-flat-button{
                border-radius: 0px !important;
                background:#4DB433 !important;
                color:#ffffff !important;
                }

                :host::ng-deep  .mat-stroked-button{
                    border-radius: 0px !important;
                    background:#ffffff !important;
                    color:#666 !important;
                }

                :host::ng-deep  .mat-stroked-button.mat-primary{
                    border-radius: 0px !important;
                    background: #10b120 !important;
                    color: white !important;
                }

                :host::ng-deep  .mat-stroked-button.mat-accent{
                    border-radius: 0px !important;
                    background: #4DB433 !important;
                    color: white !important;
                }
        `
    ],
    // encapsulation: ViewEncapsulation.None
})
export class FuseConfirmationDialogComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: FuseConfirmationConfig,
        public matDialogRef: MatDialogRef<FuseConfirmationDialogComponent>
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

}
