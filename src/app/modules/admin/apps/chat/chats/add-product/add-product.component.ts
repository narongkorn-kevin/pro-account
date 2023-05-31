import { Component, Inject, OnInit } from '@angular/core';
import { ItemService } from 'app/modules/admin/g-admin/item/item.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Product {
  name: string;
  price: number;
  quantity: number;
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

  constructor(private itemService: ItemService,
    private _matDialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.itemService.getProducts().subscribe((data: any) => {
      this.products = data.data.map((item: any) => {
        return {
          name: item.name,
          price: item.price,
          quantity: 1
        };
      });

      this.totalPages = Math.ceil(this.products.length / this.pageSize);
    });
  }

  calculateTotalPrice(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.quantity,
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
    // Implement your logic for selecting products here
  }
}
