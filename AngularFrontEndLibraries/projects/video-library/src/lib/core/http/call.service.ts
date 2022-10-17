import { Injectable } from '@angular/core';
import { Params } from '@angular/router'
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, ConnectableObservable } from 'rxjs';
import { publishReplay, timeout } from 'rxjs/operators';

import { parse, resolve } from 'url';

@Injectable()
export class CallService {

  private baseUrl: string = '/';
  private timeout = 25000;

  constructor(private readonly httpClient: HttpClient) {
    this.configure();
  }

  get<TData>(url: string, params?: Params, headers?: Params): Observable<TData> {
    return this.prepareGet<TData>(url, params, headers);
  }

  post<TData>(url: string, params?: Params, addDomain?: boolean): Observable<TData> {
    const observable = this.preparePost<TData>(url, params, addDomain)
      .pipe(timeout(this.timeout))
      .pipe(publishReplay()) as ConnectableObservable<TData>;

    observable.connect();

    return observable;
  }

  private configure() {
    this.baseUrl = '';
  };

  private prepareGet<TData>(url: string, params?: Params, headers?: Params): Observable<TData> {
    return this.httpClient
      .get<TData>(this.urlWithCorrectDomain(url), this.createOptionsForGet(params, headers));
  }

  private preparePost<TData>(url: string, params?: Params, addDomain = true): Observable<TData> {
    return this.httpClient
      .post<TData>(addDomain ? this.urlWithCorrectDomain(url) : url, params, this.createOptions());
  }

  private urlWithCorrectDomain(request: string): string {
    if (!!parse(request).host) {
      return request;
    }
    return resolve(this.baseUrl, request);
  }

  private createOptions() {
    return {
      withCredentials: true
    };
  }

  private createOptionsForGet(params?: Params, headers?: Params) {
    return {
      params: this.createParams(params),
      headers: headers,
      withCredentials: true
    };
  }

  private createParams(data?: any): HttpParams {
    let httpParams = new HttpParams();

    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] instanceof Array) {
          data[key].forEach((item: any) => {
            httpParams = httpParams.append(key.toString(), item);
          });
        } else {
          httpParams = httpParams.append(key.toString(), data[key]);
        }
      });
    }

    return httpParams;
  }
}
