
import { switchMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { UserActions } from '../actions/user.actions';
import { Order } from '../../core/models/order';
import { AddressService } from '../../checkout/address/services/address.service';
import { CState } from '../../core/models/state';
import { Country } from '../../core/models/country';
import { Address } from '../../core/models/address';

@Injectable()
export class UserEffects {

  @Effect()
  GetUserOrders$ = this.actions$
    .pipe(
      ofType(UserActions.GET_USER_ORDERS),
      switchMap<Action, Array<Order>>(_ => {
        return this.userService.getOrders();
      }),
      map(orders => this.userActions.getUserOrdersSuccess(orders))
    );

  @Effect()
  FetchUserAddress$ = this.actions$
    .pipe(
      ofType(UserActions.FETCH_USER_ADDRESS),
      switchMap<Action, Array<Address>>(_ => {
        return this.addressService.getUserAddresses();
      }),
      map(addressList => this.userActions.fetchUserAddressSuccess(addressList))
    );

  @Effect()
  FetchCountries$ = this.actions$
    .pipe(
      ofType(UserActions.FETCH_COUNTRIES),
      switchMap<Action, Array<Country>>(_ => {
        return this.addressService.getCountires();
      }),
      map(countries => this.userActions.fetchCountriesSuccess(countries))
    );

  @Effect()
  FetchStates$ = this.actions$
    .pipe(
      ofType(UserActions.FETCH_STATES),
      switchMap<Action & { payload }, Array<CState>>(action => {
        return this.addressService.getAllStates(action.payload);
      }),
      map(states => this.userActions.fetchStatesSuccess(states))
    );

  @Effect()
  DeleteUserAddress$ = this.actions$
    .pipe(
      ofType(UserActions.DELETE_ADDRESS),
      switchMap<Action & { payload }, Object>(action => {
        return this.addressService.deleteAddress(action.payload);
      }),
      map(_ => this.userActions.fetchUserAddress())
    );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private userActions: UserActions,
    private addressService: AddressService
  ) { }

}
