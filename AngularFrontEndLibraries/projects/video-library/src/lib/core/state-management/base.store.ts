import { Store } from 'rxjs-observable-store';
import { Observable, Subscription } from 'rxjs';
import { map, take, distinctUntilChanged } from 'rxjs/operators';

export class BaseStore<T extends object> extends Store<T> {

  protected constructor(initialState: T) {
    super(initialState);
  }

  select<R>(selector: (value: T, index: number) => R, compare?: (x: R, y: R) => boolean): Observable<R> {
    return this.state$.pipe(map(selector), distinctUntilChanged(compare));
  }

  selectOnce<R>(selector: (value: T, index: number) => R, compare?: (x: R, y: R) => boolean): Observable<R> {
    return this.select(selector, compare).pipe(take(1));
  }

  subscribe(fn?: any): Subscription {
    return this.state$.subscribe(fn);
  }
}
