import { environment } from './../../../../../environments/environment';
import { Product } from './../../../../core/models/product';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inner-product',
  templateUrl: './inner-product.component.html',
  styleUrls: ['./inner-product.component.scss']
})
export class InnerIproduct implements OnInit {

  @Input() product: Product;
  constructor() {
  }

  ngOnInit() {
  }

  getProductImageUrl() {
    // tslint:disable-next-line:max-line-length
    return environment.apiEndpoint + `/spree/products/${this.product.master.images[0].id}/product/${this.product.master.images[0].attachment_file_name}`
  }

}