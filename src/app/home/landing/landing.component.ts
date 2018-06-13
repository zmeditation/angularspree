import { LpPromoComponent } from './lp-promo/lp-promo.component';
import { LpVideosComponent } from './lp-videos/lp-videos.component';
import { LpBrandsComponent } from './lp-brands/lp-brands.component';
import { LpFavoritesComponent } from './lp-favorites/lp-favorites.component';
import { LpProductListComponent } from './lp-product-list/lp-product-list.component';
import { Observable } from 'rxjs/Observable';
import { getProducts, getTaxonomies } from './../../product/reducers/selectors';
import { ProductActions } from './../../product/actions/product-actions';
import { Store } from '@ngrx/store';
import { AppState } from './../../interfaces';
import { Product } from './../../core/models/product';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DragScrollDirective } from 'ngx-drag-scroll';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  products$: Observable<any>;

  constructor(private store: Store<AppState>, private actions: ProductActions) {
    this.store.dispatch(this.actions.getAllProducts());
    this.products$ = this.store.select(getProducts);
  }

  ngOnInit() {

  }
}
