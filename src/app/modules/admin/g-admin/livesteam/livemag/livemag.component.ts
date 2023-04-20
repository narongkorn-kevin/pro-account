import { Component } from '@angular/core';

@Component({
  selector: 'app-livemag',
  templateUrl: './livemag.component.html',
  styleUrls: ['./livemag.component.scss']
})
export class LivemagComponent {
  products = [
    { id: '001', name: 'Monitor', quantity: 10, image: 'ตัวอย่าง' },
    { id: '002', name: 'Bag', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '003', name: 'Dove', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '004', name: 'Dior', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '005', name: 'Givenchy', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '006', name: 'Chanel', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '007', name: 'Gucci', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '008', name: 'Cartier', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '009', name: 'Tiger', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '010', name: 'Hermes', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '011', name: 'Prada', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '012', name: 'Boss', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '013', name: 'MAC', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '014', name: 'Ipad 8', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '015', name: 'IP14', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '016', name: 'S23 Plus', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '017', name: 'Camera', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '018', name: 'Laptop', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '019', name: 'Sneaker', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '020', name: 'Glasses', quantity: 12, imageUrl: '/images/ifrv492j.png' },
];
  
isLoading: boolean = false;

  toggleProductStatus(product) {
    product.isActive = !product.isActive;
  }
}