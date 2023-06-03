import { Component, Inject, OnInit } from '@angular/core';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Product {
  name: string;
  unit_price: number;
  qty: number;
  quantity: number;
  remainingAmount: number;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  itemP$: any;
  selectedImage: any;

  constructor(
    private itemService: ItemService,
    private _matDialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.itemService.itemP$.subscribe((items: any[]) => {
      this.products = items.map((item: any) => {
        return {
          name: item.name,
          unit_price: item.unit_price,
          qty: item.qty,
          quantity: 0, // Set the default quantity to 0
          remainingAmount: item.remainingAmount // Assuming remaining amount is available in the item object
        };
      });

      this.totalPages = Math.ceil(this.products.length / this.pageSize);
    });

    this.itemService.getItemPage().subscribe(); // Trigger the API call
  }

  calculateTotalPrice(): number {
    return this.products.reduce(
      (total, product) => total + product.unit_price * product.quantity,
      0
    );
  }

  AddItem(): number {
    return this.products.reduce(
      (total, product) => total + product.unit_price * product.quantity,
      0
    );
  }


  decreaseQuantity(product: Product): void {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }

  increaseQuantity(product: Product): void {
    product.quantity++;
  }

  selectProducts(): void {
  }

  confirmSelection(): void {
    const selectedProducts = this.products.filter((product) => product.quantity > 0);
    // console.log(selectedProducts);
this._matDialogRef.close(selectedProducts)
  }




  resetSelection(): void {
    this.products.forEach((product) => (product.quantity = 0));
  }

  getNumberOfSelectedProducts(): number {
    return this.products.reduce((total, product) => total + (product.quantity > 0 ? 1 : 0), 0);
  }
}
