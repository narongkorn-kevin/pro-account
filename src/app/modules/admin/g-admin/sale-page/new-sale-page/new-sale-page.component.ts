import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  debounceTime,
  map,
  merge,
  startWith,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  lastValueFrom,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { identity, sortBy, startCase } from 'lodash-es';
import { AssetType, salePagePagination } from '../sale-page.types';
import { SalePageService } from '../sale-page.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
import { BranchService } from '../../branch/branch.service';
import { ModalItem } from '../../item/modal-item/modal-item.component';
import { DialogCustomerComponent } from '../../customer/dialog-customer/dialog-customer.component';
import { DialogAddressComponent } from '../../customer/dialog-address/dialog-address.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
  selector: 'app-new-sale-page',
  templateUrl: './new-sale-page.component.html',
  styleUrls: ['./new-sale-page.component.scss'],
  animations: fuseAnimations,
})
export class NewSalePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  modalPopupObject: any;
  display: boolean = false;
  vegetables = [
    { name: 'Label', type: 'label', inputType: 'label' },
    { name: 'text', type: 'input-text', inputType: 'text', placeholder: '' },
    { name: 'checkbox', type: 'input-check', inputType: 'checkbox', placeholder: null, displayText: 'Check box' }];

  droppedVegetables = [];
  droppedItems = [];
  dragEnabled = true;
  htmlText: any;
  test: string = '';
  currentDraggedItem: any;
  formData: FormGroup;
  flashErrorMessage: string;

  uploadPic: FormGroup;
  departmentData: any = [];
  positionData: any = [];
  userData: any = [];
  // saleData: any = [];
  customerData: any = [];
  branchData: any = [];
  channelData: any = [];
  deliveryData: any = [];
  selection: any;
  selection1: any;
  selection2: any;
  selection3: any;
  selection4: any;
  selection5: any;
  selection6: any;
  saleData: any = [];
  bankData: any = [];
  eventname: string;
  prod_name: any;
  image: any;
  qty: any;
  unit_price: any;
  formDataSocial: FormGroup;
  change1: any;

  files: File[] = [];
  filesSignature: File[] = [];

  asset_types: AssetType[];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  fileUpload: string;
  fileUploadData: string;
  tagsEditMode: boolean = false;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;

  // me: any | null;
  // get roleType(): string {
  //     return 'marketing';
  // }

  supplierId: string | null;
  pagination: salePagePagination;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    // private _Service: PermissionService,
    private _Service: SalePageService,
    private _ServicePosition: PositionService,
    private _ServiceDepartment: DepartmentService,
    private _ServiceBranch: BranchService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService
  ) {
    this.formDataSocial = this._formBuilder.group({
      facebook_pixel: this._formBuilder.array([]),
      tiktok_pixel: this._formBuilder.array([])
    })
    this.modalPopupObject = {};
    this.formData = this._formBuilder.group({
      select_product_id: [''],
      customer_id: [''],
      delivery_by_id: [''],
      channal: [''],
      language: [''],
      name: [''],
      telephone: [''],
      sale_id: [''],
      email: [''],
      address: [''],
      shipping_price: [''],
      cod_price_surcharge: [''],
      sale_pages_url: [''],
      type: [''],
      thank_you_url: [''],
      bank_id: [''],
      status: [''],
      payment_type: [''],
      product_name: [''],
      payment_date: [''],
      main_discount: [''],
      payment_qty: [''],
      vat: [''],
      total: [''],
      channal_remark: [''],
      account_number: [''],
      salepage_promotion: this._formBuilder.array([]),
      salepage_pixel: this._formBuilder.array([]),
      sale_page_line: this._formBuilder.array([]),
    });

    this.uploadPic = this._formBuilder.group({
      image: '',
      path: '',
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit(): Promise<void> {
    this.formData.reset();
    this.formDataSocial = this._formBuilder.group({
      facebook_pixel: this._formBuilder.array([]),
      tiktok_pixel: this._formBuilder.array([])
    })
    this.addFacebook();
    this.addTiktok();
    this.selection1 = true;
    this.selection2 = true;
    this.selection3 = 1;
    this.selection4 = true;
    this.selection5 = 1;
    this.selection6 = true;
    (this.uploadPic = this._formBuilder.group({
      image: '',
      path: 'images/item/',
    }));

    this.formData.patchValue({
      bank_id: '',
      delivery_by_id: '',
      type: '',
      language: '',
    })
    const bank = await lastValueFrom(this._Service.getbank());
    this.bankData = bank.data;

    const delivery = await lastValueFrom(this._Service.getdelivery());
    this.deliveryData = delivery.data;

    this._Service.getcustomer().subscribe((resp: any) => {
      this.customerData = resp.data;
      for (let i = 0; i < this.customerData.length; i++) {
        // console.log('test',this.customerData[i].name);
        this.options.push(this.customerData[i].name);
      }
      // this.options = this.customerData;
      // console.log(this.options,'test')
      // console.log('cus', this.options);
    });
    this._Service.getuser().subscribe((resp: any) => {
      this.saleData = resp.data;
      // console.log('userData', this.saleData);
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );


  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  promotion(): FormArray {
    return this.formData.get('salepage_promotion') as FormArray;
  }
  pixel(): FormArray {
    return this.formData.get('salepage_pixel') as FormArray;
  }
  NewPixel(): FormGroup {
    return this._formBuilder.group({
      pixel_id: '',
      access_token: '',



    });
  }


  facebook(): FormArray {
    return this.formDataSocial.get('facebook_pixel') as FormArray;
  }
  NewFacebook(): FormGroup {
    return this._formBuilder.group({
      piexel_id: '',
      access_token: '',
    });
  }
  addFacebook(): void {
    this.facebook().push(this.NewFacebook());

  }
  removeFacebook(index: number): void {
    if (index !== 0) {
      this.facebook().removeAt(index);
    }
  }

  tiktok(): FormArray {
    return this.formDataSocial.get('tiktok_pixel') as FormArray;
  }
  NewTiktok(): FormGroup {
    return this._formBuilder.group({
      piexel_id: '',
    });
  }
  addTiktok(): void {
    this.tiktok().push(this.NewTiktok());

  }
  removeTiktok(index: number): void {
    if (index !== 0) {
      this.tiktok().removeAt(index);
    }
  }
  NewPROMOTION(): FormGroup {
    return this._formBuilder.group({
      name: '',
      price: 0,
      qty: 0,


    });
  }
     onChange1(data): void {
        this.change1 = data.target.checked;
    }
  addPromotion(): void {
    this.promotion().push(this.NewPROMOTION());
    // console.log(this.formData.value)
    // alert(1)
  }

  removePromotion(i: number): void {
    this.promotion().removeAt(i);
  }

  addpixel(): void {
    this.pixel().push(this.NewPixel());
    // console.log(this.formData.value)
    // alert(1)
  }

  removepixel(i: number): void {
    this.pixel().removeAt(i);
  }
  discard(): void { }
  /**
   * After view init
   */
  ngAfterViewInit(): void { }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
  }

  dateTimeLocal(stringDate: string) {
    if (!stringDate) {
      return null;
    }
    let arr = stringDate.split(' ');
    return arr[0] + 'T' + arr[1];
  }

  newSalePage(): void {
    // console.log(this.formData.value);
    // return

    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    // if (this.formData.invalid) {
    //     return;
    // }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'สร้างเซลล์เพจ',
      message: 'คุณต้องการสร้างเซลล์เพจใหม่ ',
      icon: {
        show: false,
        name: 'heroicons_outline:exclamation',
        color: 'warning',
      },
      actions: {
        confirm: {
          show: true,
          label: 'ยืนยัน',
          color: 'primary',
        },
        cancel: {
          show: true,
          label: 'ยกเลิก',
        },
      },
      dismissible: true,
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        this._Service.createsalepage(this.formData.value).subscribe({
          next: (resp: any) => {
            this._router
              .navigateByUrl('sale-page/list')
              .then(() => { });
          },
          error: (err: any) => {
            this._fuseConfirmationService.open({
              title: 'กรุณาระบุข้อมูล',
              message: err.error.message,
              icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
              },
              actions: {
                confirm: {
                  show: false,
                  label: 'ยืนยัน',
                  color: 'primary',
                },
                cancel: {
                  show: false,
                  label: 'ยกเลิก',
                },
              },
              dismissible: true,
            });
            console.log(err.error.message);
          },
        });
      }
    });
  }

  showFlashMessage(type: 'success' | 'error'): void {
    // Show the message
    this.flashMessage = type;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    // Trigger Image Preview
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
    }, 150);

    this.uploadPic.patchValue({
      image: this.files[0],
    });

    const formData = new FormData();
    Object.entries(this.uploadPic.value).forEach(([key, value]: any[]) => {
      formData.append(key, value);
    });
    this._Service.uploadImg(formData).subscribe((resp) => {
      this.formData.patchValue({
        image_slip: resp,
      });
      // console.log('image_slip', this.formData.value.image_slip);
    });
  }

  onRemove(event) {
    // console.log('1', event);
    this.files.splice(this.files.indexOf(event), 1);
    this.formData.patchValue({
      image_slip: '',
    });
    console.log(this.formData.value);
  }

  onSelectSignature(event) {
    console.log(event);
    this.filesSignature.push(...event.addedFiles);
    // Trigger Image Preview
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
    }, 150);
    this.formData.patchValue({
      image_signature: this.filesSignature[0],
    });
    console.log(this.formData.value);
  }

  onRemoveSignature(event) {
    // console.log('1', event);
    this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
    this.formData.patchValue({
      image_signature: '',
    });
    console.log(this.formData.value);
  }

  openDialog() {
    let itemData = this.formData.value;
    const dialogRef = this._matDialog.open(ModalItem, {
      width: '1200px',
      height: '750px',
    });

    // ปิด Dialog พร้อมรับค่า result
    dialogRef.afterClosed().subscribe((item) => {
      if (item) {
        itemData = {
          select_product_id: item.id,
          product_name: item.name,
          image: item.image,
          qty: item.qty,
          unit_price: item.unit_price,

        };
      }
      if (item) {
        this.prod_name = itemData.product_name
        this.image = itemData.image
        this.qty = itemData.qty
        this.unit_price = itemData.unit_price
        // console.log('itemData',itemData)
        this.formData.patchValue({
          select_product_id: itemData.select_product_id,
          product_name: itemData.product_name,
        })
      }
    });
  }

  onSubmits(): void {
    console.log(this.formData.value);
  }

  //////////// วันที่
  toDay() {
    const date = new Date();
    let resDate;
    // Set the date
    resDate =
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0');
    return resDate;
  }
  dateTimeLocalDefault() {
    let date = new Date();
    let m: any = date.getMonth() + 1;
    let d: any = date.getDate();
    let hour: any = date.getHours();
    let minute: any = date.getMinutes();
    let second: any = date.getSeconds();
    if (m < 10) {
      m = '0' + m;
    }
    if (d < 10) {
      d = '0' + d;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return (
      date.getFullYear() +
      '-' +
      m +
      '-' +
      d +
      'T' +
      hour +
      ':' +
      minute +
      ':' +
      second
    );
  }

  onValChange(value): void {
    this.selection = value.target.checked;
    // console.log('selec',value)
    // console.log('selec',this.selection)
    // this.loadTable(this.formFillter);
  }
  onValChangeCOD(value): void {
    this.selection1 = value.target.checked;

  }

  onValChangeTran(value): void {
    this.selection2 = value.target.checked;

  }
  onValChangesell(value): void {
    this.selection3 = value.target.checked;

  }
  OTTO(value): void {
    this.selection4 = value.target.checked;

  }
  events(value): void {
    this.selection4 = value.target.checked;

  }

  onAnyDrop(e: any) {
    this.currentDraggedItem = e;
    if (e.dragData.type !== 'label') { this.display = true; }
    else {
      this.updateDroppedItem();
      this.updateDroppedItem();
    }


  }

  updateHtmlCode(): void {
    this.htmlText = this.droppedItems;
  }


  renderHtmlCode(htmlObject: any): string {
    if (htmlObject.inputType === 'label') {
      return '<label> </label>';
    } else {
      return '<input type="' + htmlObject.inputType
        + '" placeholder="' + htmlObject.placeholder + '" />';
    }
  }

  onSubmit(f: any): void {
    this.display = false;
    this.updateDroppedItem();
  }

  updateDroppedItem(): void {
    // this.currentDraggedItem.dragData.placeholder = e.placeholder;
    this.droppedItems.push(this.currentDraggedItem.dragData, 'test');
    this.updateHtmlCode();
    this.test += this.renderHtmlCode(this.currentDraggedItem.dragData);
  }

  onSubmit2(): void {
    // alert('1')
  }


}
