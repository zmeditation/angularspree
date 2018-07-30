import { relatedProducts, productReviews } from './../../../reducers/selectors';
import { ProductActions } from './../../../actions/product-actions';
import { Observable } from 'rxjs';
import { getProductsByKeyword } from './../../../../home/reducers/selectors';
import { SearchActions } from './../../../../home/reducers/search.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';

import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { Product } from './../../../../core/models/product';
import { ProductService } from './../../../../core/services/product.service';
import { Meta, Title } from '@angular/platform-browser';
import { getAuthStatus } from '../../../../auth/reducers/selectors';
import { environment } from '../../../../../environments/environment';
import { Taxon } from '../../../../core/models/taxon';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  @Input() product: Product;

  description: any;
  images: any;
  variantId: any;
  productID: any;
  isMobile = false;
  screenwidth: any;
  isAuthenticated: boolean;
  similarProducts$: Observable<any>;
  relatedProducts$: Observable<any>;
  reviewProducts$: Observable<any>;
  frontEndUrl = environment.config.frontEndUrl;
  schema: any;
  selectedVariant: any;
  brand: Taxon;

  constructor(
    private checkoutActions: CheckoutActions,
    private store: Store<AppState>,
    private productService: ProductService,
    private router: Router,
    private toastrService: ToastrService,
    private searchActions: SearchActions,
    private productsActions: ProductActions,
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit() {
    this.screenwidth = window.innerWidth;
    this.calculateInnerWidth();

    this.addMetaInfo(this.product);

    this.initData();

    this.store.dispatch(this.productsActions.getRelatedProduct(this.productID));
    this.relatedProducts$ = this.store.select(relatedProducts);

    this.store.dispatch(this.productsActions.getProductReviews(this.productID));
    this.reviewProducts$ = this.store.select(productReviews);

    this.addJsonLD(this.product);

    this.findBrand();
  }

  initData() {
    if (this.product.has_variants) {
      const product = this.product.variants[0];
      this.description = product.description;
      this.images = product.images;
      this.variantId = product.id;
      this.selectedVariant = product;
      this.productID = this.product.id;
      this.product.display_price = product.display_price;
      this.product.price = product.price;
      this.product.master.is_orderable = product.is_orderable;
      this.product.master.cost_price = product.cost_price;
    } else {
      this.description = this.product.description;
      this.images = this.product.master.images;
      this.variantId = this.product.master.id;
      this.productID = this.product.id;
      this.selectedVariant = this.product.master;
    }

    if (this.product.taxon_ids[0]) {
      this.store.dispatch(
        this.searchActions.getProductsByTaxon(`id=${this.product.taxon_ids[0]}`)
      );
      this.similarProducts$ = this.store.select(getProductsByKeyword);
    }
  }

  calculateInnerWidth() {
    if (this.screenwidth <= 800) {
      this.isMobile = this.screenwidth;
    }
  }

  addToCart(event) {
    if (event.buyNow) {
      this.store.dispatch(
        this.checkoutActions.addToCart(this.variantId, event.count)
      );
      setTimeout(() => { this.router.navigate(['checkout', 'cart']); }, 1500)
    } else {
      this.store.dispatch(
        this.checkoutActions.addToCart(this.variantId, event.count)
      );
    }
  }

  markAsFavorite() {
    this.productService.markAsFavorite(this.product.id).subscribe(res => {
      this.toastrService.info(res['message'], 'info');
    });
  }

  showReviewForm() {
    this.router.navigate([this.product.slug, 'write_review'], {
      queryParams: { prodId: this.productID }
    });
  }

  selectVariant(variant) {
    this.images = variant.images;
    this.variantId = variant.id;
    this.selectedVariant = variant;
    this.addJsonLD(this.product);
  }

  get selectedImage() { return this.images ? this.images[0] : ''; }

  addMetaInfo(product: Product) {
    this.meta.updateTag({
      name: 'description',
      content: product.meta_description
    });

    this.meta.updateTag({
      name: 'keywords',
      content: product.meta_keywords
    });

    this.meta.updateTag({ name: 'title', content: product.slug });
    this.meta.updateTag({ name: 'apple-mobile-web-app-title', content: environment.appName });
    this.meta.updateTag({ property: 'og:description', content: product.meta_description });
    this.meta.updateTag({ property: 'og:url', content: environment.config.frontEndUrl }),
      this.title.setTitle(this.product.name),
      this.meta.updateTag({ property: 'twitter:title', content: this.product.description });
  }

  addJsonLD(product: Product) {
    this.schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'url': location.href,
      'itemCondition': 'https://schema.org/NewCondition',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.avg_rating,
        'reviewCount': product.reviews_count
      },
      'description': product.meta_description,
      'name': product.name,
      'image': this.selectedImage && this.selectedImage.product_url,
      'offers': [{
        '@type': 'Offer',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': this.selectedVariant.is_orderable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'price': this.selectedVariant.price,
        'priceCurrency': this.selectedVariant.currency,
      }]
    };
  }

  scrollToReviewMobile() {
    document.getElementById('review').scrollIntoView({ behavior: 'smooth' });
  }

  findBrand() {
    const brandClassification = this.product.classifications.find(element =>
      element.taxon.pretty_name.includes('Brands')
    );
    this.brand = brandClassification && brandClassification.taxon;
  }
}
