import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({ selector: '[domChange]' })
export class DomChangeDirective implements OnDestroy {
  private elementRef: ElementRef;
  private changes: MutationObserver;

  @Output() domChange: EventEmitter<{}>;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    this.domChange = new EventEmitter();

    this.changes = new MutationObserver(((mutations) => {
      mutations.forEach((
        (mutation) => this.domChange.emit(mutation)));
    }));

    this.changes.observe(this.elementRef.nativeElement, {
      attributes: true
    });
  }

  ngOnDestroy() {
    this.changes.disconnect();
  }
}
