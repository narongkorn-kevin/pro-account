import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, lastValueFrom, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, CustomerPagination } from '../item.types';
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
import { ItemSetComponent } from '../item-set/item-set.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-item',
    templateUrl: './new-item.component.html',
    styleUrls: ['./new-item.component.scss'],
    animations: fuseAnimations
})

export class NewItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup
    formData1: FormGroup
    attributeform: FormGroup
    uploadPic: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    files1: File[] = [];
    files2: File[] = [];
    files3: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;

    secondAttribute: any[] = []

    productStatus: any = 'normal'


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,

        private _Service: ItemService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,

    ) {

        this.formData = this._formBuilder.group({
            vendor_id: '',
            location_id: '',
            item_id: null,
            name: '',
            brand: '',
            image: '',
            unit_cost: '',
            weight: '',
            hight: '',
            width: '',
            qty: '',
            unit_price: '',
            description: '',
            item_type_id: '',
            set_type: 'normal',
            item_attribute: this._formBuilder.array([]),
            item_image: this._formBuilder.array([]),
        }),
            this.formData1 = this._formBuilder.group({
                vendor_id: '',
                location_id: '',
                item_id: null,
                name: '',
                brand: '',
                image: '',
                unit_cost: '',
                weight: '',
                hight: '',
                unit_price: '',
                description: '',
                item_type_id: '',
                set_type: 'set_products',
            }),
           
            this.uploadPic = this._formBuilder.group({
                image: '',
                path: ''
            })


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     item_attribute1(): FormArray {
        return this.formData.get('item_attribute') as FormArray
    }
    get item_attribute(): FormArray {
        return this.formData.get('item_attribute') as FormArray
    }
    get item_image(): FormArray {
        return this.formData.get('item_image') as FormArray
    }
    newAttribute(): FormGroup {
        return this._formBuilder.group({
            image: '',
            name: '',
            unit_cost: '',
            unit_price: '',
            qty: '',
            item_attribute_second: this._formBuilder.array([]),
        });
    }
    newImage(): FormGroup {
        return this._formBuilder.group({
            image: '',
            // ['images_' + this.imageFieldIndex]: new FormControl(null, Validators.required)
            
            
        });
    }
    addAttribute(): void {
        this.item_attribute.push(this.newAttribute());
        //const control = this.formData.controls.item_image as FormArray;
        
        console.log('formData',this.formData.value.item_attribute);
        }
    addImage(): void {
        this.item_image.push(this.newImage());
        // this.item_image.push(this._formBuilder.group({
        //     ['images_' + this.imageFieldIndex]: new FormControl(null, Validators.required)
        //   }));
        //   this.imageFieldIndex++;
        // this.imageFieldIndex++;
        console.log('formData',this.formData.value.item_image);
        }
    item_attribute_sec(): FormGroup {
        return this._formBuilder.group({
            image: '',
            name: "",
            unit_cost: '',
            unit_price: '',
            qty: ''
        });
    }
    click2 = 0
    addAttribute_sec(i): void {
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        // console.log(control)
        control.push(this.item_attribute_sec());
        console.log('control',this.formData.value);
        this.click2=1;
    }
    getItem_attribute_second(form) {
        return form.controls.item_attribute_second.controls;
    }
    removeAttribute(i, j: number): void {
        // alert(1)
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        control.removeAt(j);
        
    }
    removeItemAt(i: number): void {
        this.item_attribute1().removeAt(i);
        // this.sumPrice()
    }
    removeItemSec(i: number,j: number): void {
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        control.removeAt(j);
        // this.sumPrice()
    }
        
        
    

    async ngOnInit(): Promise<void> {
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/item/'
        })


        const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        this.itemtypeData = itemtype.data;

        // const location = await lastValueFrom(this._ServiceLocation.getLocation())
        // this.locationData = location.data;

        const vendor = await lastValueFrom(this._ServiceVendor.getVendor())
        this.vendorData = vendor.data;
        console.log('this.vendorData', this.vendorData);

        
        // this.formData = this._formBuilder.group({
        //     vendor_id: '',
        //     // location_id: '',
        //     item_id: null,
        //     name: '',
        //     hight: '',
        //     brand: '',
        //     image: '',
        //     weight: '',
        //     unit_cost: '',
        //     unit_price: '',
        //     description: '',
        //     item_type_id: '',
        //     set_type: 'normal',
        // })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {

    }
    CreateItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างสินค้าใหม่",
            "message": "คุณต้องการสร้างสินค้าใหม่ใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": 'heroicons_outline:plus-circle',
                "color": 'info',
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        confirmation.afterClosed().subscribe(async (result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                const ImgPath = new FormData()
                ImgPath.append('image',this.files2[0])
                ImgPath.append('path','/images/item/')
                const img = await lastValueFrom( this._Service.uploadImg(ImgPath))
                this.formData.patchValue({
                    item_image: [img]
                })
                // console.log('Image',this.formData.value);
                
                const formValue = this.formData.value
                this._Service.NewItemSet(formValue).subscribe(
                    {
                        next: (resp: any) => {
                            this._router.navigateByUrl('item/list').then(() => { })
                        },
                        error: (err: any) => {

                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                            console.log(err.error.message)
                        }

                    }
                )


            }
        });
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)


        this.uploadPic.patchValue({
            image: this.files[0],
        });
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image: resp
            })
            console.log(this.formData.value)
        })
    }
    onSelect1(event,i) {
        console.log(event);
        // const imageData:any = this._formBuilder.group({
        //     ...event.addedFiles,
        //     images: this._formBuilder.array([])
        // })
        
         this.files1.push(...event.addedFiles);
        // this.files1.push(imageData);
        // console.log('file1',this.files1);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)


        this.uploadPic.patchValue({
            image: this.files1[0],
        });
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        const control = this.formData.value.item_attribute
        this._Service.uploadImg(formData).subscribe((resp) => {
            control[i] = {image:resp}
            this.formData.controls.item_attribute.patchValue(control);
            console.log(this.formData.value.item_attribute)
        })
        
        
        
        
        
    }
    
    onSelect2(event,i,j) {
        console.log(event);
        this.files3.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)

        for (let index = 0; index < this.files3.length; index++) {
            const element = this.files3[index];
            this.uploadPic.patchValue({
                image: this.files3[index],
            });
            
        }
        // this.uploadPic.patchValue({
        //     image: this.files3[i],
        // });
        
        const formData = new FormData();
        Object.entries(this.uploadPic?.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        
        // const control = this.formData.value.item_attribute[i].item_attribute_second
        const control = this.formData.get('item_attribute').value[i].item_attribute_second as FormArray;
        this._Service.uploadImg(formData).subscribe((resp) => {
            control[i] = {image:resp}
            // control.at(j)?.patchValue({ image: resp });
            // this.formData.controls.item_attribute[i].controls.item_attribute_second.patchValue(control);
            console.log('Hello',this.formData.value.item_attribute[i].item_attribute_second)
            // const newControl = this._formBuilder.group({
            //     image: resp,
            //     });
                
            //     // เปลี่ยนค่าใน FormArray ด้วย setControl โดยให้ newControl แทนที่ control ของ Index j
            //     control.insert(j, newControl);
                
            //     console.log('Hello', this.formData.value.item_attribute[i].item_attribute_second);
        })
        
        
    }
    imageFieldIndex = 0;
    // AddImage() {
    //     const control = this.formData.controls.item_image as FormArray;
    //     control.push(this._formBuilder.group({
    //       ['images_' + this.imageFieldIndex]: new FormControl(null, Validators.required)
    //     }));
    //     this.imageFieldIndex++;
    //   }
    getFiles(index: number): File[] {
        const control = this.formData.controls.item_image as FormArray;
        const fieldName = 'images_' + index;
        return control.controls[index].get(fieldName)?.value;
      }
    // OnRemove1(file: File, index: number) {
    //     const control = this.formData.controls.item_image as FormArray;
    //     const fieldName = 'images_' + index;
    //     const files = control.controls[index].get(fieldName).value as File[];
    //     const filteredFiles = files.filter((f) => f !== file);
    //     control.controls[index].get(fieldName).setValue(filteredFiles);
    //   }
    onSelectMullti(event,i) {
        console.log(event);
        this.files2.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)


        this.uploadPic.patchValue({
            image: this.files2[0],
        });
        
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        const control = this.formData.value.item_image
        this._Service.uploadImg(formData).subscribe((resp) => {
            control[i] = {image:resp}
            
            this.formData.controls.item_image.patchValue(control);
            console.log(this.formData.value.item_image)
        })
        
        
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
    onRemove1(event) {
        console.log('1', event);
        this.files1.splice(this.files1.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
    onRemove2(event) {
        console.log('1', event);
        this.files2.splice(this.files2.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
    onclick1() {
        this.productStatus = 'normal'
    }
    onclick2() {
        this.productStatus = 'set'
    }
    itemset: any[] = [];
    openSetDialog(): void {
        //console.log(id, "test id");
        this._matDialog
          .open(ItemSetComponent, {
            disableClose: false,
            autoFocus: false,
            // height: "80%",
            width:'100%'
            //recive brandId
            // data: { userId: id },
          })
          .afterClosed()
          .subscribe((res) => {
            
            this.itemset=(res);
            console.log('this.itemset',this.itemset);
            /**ถ้าส่ง successfull มาจะทำการรีโหลดตาราง */
            
          });
      }

}
