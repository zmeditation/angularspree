import { deserialize } from 'jsonapi-deserializer';
import { JsonApiParserService } from './json-api-parser.service';
import { CJsonApi } from './../models/jsonapi';
import { ToastrService } from 'ngx-toastr';
import { Taxonomy } from './../models/taxonomy';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {
  /**
   * Creates an instance of ProductService.
   * @param {HttpService} http
   *
   * @memberof ProductService
   */
  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private apiParser: JsonApiParserService,
  ) { }
  // tslint:disable-next-line:member-ordering
  success: any;
  // tslint:disable-next-line:member-ordering
  error: any;
  /**
   *
   *
   * @param {string} id
   * @returns {Observable<Product>}
   *
   * @memberof ProductService
   */
  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(
        `http://localhost:3000/api/v1/products/${id}?${+new Date().getDate()}`
      )
  }

  getProductReviews(products): Observable<any> {
    return this.http.get(`products/${products}/reviews`);
  }

  /**
   *
   *
   * @returns {Array<Taxonomy>}
   *
   * @memberof ProductService
   */
  getTaxonomies(): any { return this.http.get<Array<Taxonomy>>(`http://localhost:3000/api/v1/taxonomies`); }

  /**
   *
   *
   * @returns {Array<Product>}
   *
   * @memberof ProductService
   */
  getProducts(pageNumber: number): Observable<Array<Product>> {
    // sort=A-Z&filter[name]=Hill's&page[limit]=2&page[offset]=2
    return this.http
      .get<Array<Product>>(
        `http://localhost:3000/api/v1/products?q[s]=avg_rating+desc&page[limit]=20&page[offset]=${pageNumber}`
      )
  }

  markAsFavorite(id: number): Observable<{}> {
    return this.http.post<{}>(`favorite_products`, { id: id });
  }

  removeFromFavorite(id: number): Observable<{}> {
    return this.http.delete<{}>(`favorite_products/${id}`);
  }

  getFavoriteProducts(): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(
        `favorite_products.json?per_page=20&data_set=small`
      )
      .pipe(
        map(
          (resp: any) => resp.data
          // resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }

  getUserFavoriteProducts(): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(
        `spree/user_favorite_products.json?data_set=small`
      )
      .pipe(
        map(
          resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }

  // tslint:disable-next-line:max-line-length
  getProductsByTaxon(id: string): Observable<any> {
    return this.http
      .get<{ data: CJsonApi[]; pagination: Object }>(
        `api/v1/taxons/products?${id}&per_page=20&data_set=small`
      )
      .pipe(
        map(resp => {
          return {
            pagination: resp.pagination,
            products: this.apiParser.parseArrayofObject(resp.data) as Array<Product>
          };
        })
      );
  }

  getProductsByTaxonNP(id: string): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(
        `api/v1/taxons/products?id=${id}&per_page=20&data_set=small`
      )
      .pipe(
        map(
          (resp: any) => resp.data
          // resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }

  getTaxonByName(name: string): Observable<Array<Taxonomy>> {
    return this.http.get<Array<Taxonomy>>(
      `api/v1/taxonomies?q[name_cont]=${name}&set=nested&per_page=2`
    );
  }

  getproductsByKeyword(keyword: string): Observable<any> {
    return this.http
      .get<{ data: CJsonApi[]; pagination: Object }>(
        `api/v1/products?${keyword}&per_page=20&data_set=small&${+new Date().getDate()}`
      )
      .pipe(
        map(resp => {
          return {
            pagination: resp.pagination,
            products: this.apiParser.parseArrayofObject(resp.data) as Array<
              Product
              >
          };
        })
      );
  }

  getChildTaxons(
    taxonomyId: string,
    taxonId: string
  ): Observable<Array<Taxonomy>> {
    return this.http.get<Array<Taxonomy>>(
      `/api/v1/taxonomies/${taxonomyId}/taxons/${taxonId}`
    );
  }

  submitReview(productId: any, params: any) {
    return this.http.post(`products/${productId}/reviews`, params).pipe(
      map(
        success => {
          this.success = success;
          if (this.success.type === 'info') {
            this.toastrService.info(this.success.message, this.success.type);
            return this.success.type;
          } else {
            this.toastrService.success(this.success.message, this.success.type);
            return this.success.type;
          }
        },
        error => {
          this.error = error;
          this.toastrService.error(this.error.message, this.error.type);
          return this.error.type;
        }
      )
    );
  }

  getRelatedProducts(productId: any): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(`api/products/${productId}/relations`)
      .pipe(
        map(
          resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }
}
