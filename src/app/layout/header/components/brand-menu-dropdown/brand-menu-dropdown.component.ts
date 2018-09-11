import { Store } from '@ngrx/store';
import { AppState } from './../../../../interfaces';
import { SearchActions } from './../../../../home/reducers/search.actions';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brand-menu-dropdown',
  templateUrl: './brand-menu-dropdown.component.html',
  styleUrls: ['./brand-menu-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandMenuDropdownComponent implements OnInit, OnDestroy {
  @Input() taxonomies;
  queryParams: any;
  isOpen: any;
  subscriptionList$: Array<Subscription> = [];
  constructor(
    private route: ActivatedRoute,
    private searchActions: SearchActions,
    private store: Store<AppState>) {
    this.subscriptionList$.push(
      this.route.queryParams
        .subscribe(params => {
          this.queryParams = params
        })
    );
  }

  ngOnInit() {
  }

  getBrands() {
    const search = new URLSearchParams();
    search.set('id', this.queryParams.id);
    this.store.dispatch(this.searchActions.getProductsByTaxon(search.toString()));
  }
  onOpenChange(data: boolean): void {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy() {
    this.subscriptionList$.forEach(sub$ => sub$.unsubscribe());
  }
}
