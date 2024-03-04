When creating forms in Angular, sometimes you want to have an input that isn’t a standard text input, select, or checkbox. By implementing the ControlValueAccessor interface and registering the component as a NG_VALUE_ACCESSOR, you can integrate your custom form control seamlessly into template driven or reactive forms just as if it were a native input!

https://alligator.io/angular/custom-form-control/

# Custom Form Control

In order to make the RatingInputComponent behave as though it were a native input (and thus, a true custom form control), we need to tell Angular how to do a few things:

Write a value to the input - writeValue

Register a function to tell Angular when the value of the input changes - registerOnChange

Register a function to tell Angular when the input has been touched - registerOnTouched

Disable the input - setDisabledState

These four things make up the ControlValueAccessor interface, the bridge between a form control and a native element or custom input component. Once our component implements that interface, we need to tell Angular about it by providing it as a NG_VALUE_ACCESSOR so that it can be used.

With these changes, our new RatingInputComponent now looks something like this:

```typescript
// rating-input.component.ts
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'kar-rating-component-new',
  templateUrl: './rating-component-new.component.html',
  styleUrls: ['./rating-component-new.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponentNewComponent),
      multi: true
    }
  ]
})
export class RatingComponentNewComponent implements ControlValueAccessor {
  rating = 0;

  maxRating = 5;

  stars: boolean[] = Array(this.maxRating);

  disabled = false;

  onChange: (rating: number) => {};

  onTouched: () => {};

  constructor() {}

  // ngOnInit() {
  //   this.setStarsArray();
  // }

  setStarsArray() {
    // this.stars = _.fill(Array(this.maxRating), true, 0, this.rating);
    for (let index = 0; index < this.stars.length; index++) {
      // const starred = this.stars[index];
      if (index < this.rating) {
        this.stars[index] = true;
      } else {
        this.stars[index] = false;
      }
    }
  }

  onStarClick(starred: boolean, index: number) {
    if (!this.disabled) {
      let newRating: number;
      const starIndex = index + 1;
      if (!starred) {
        newRating = starIndex;
      } else {
        if (this.rating > starIndex) {
          newRating = starIndex;
        } else {
          newRating = starIndex - 1;
        }
      }
      this.rate(newRating);
    }
  }

  rate(rating: number) {
    this.rating = rating;
    this.setStarsArray();
    this.onChange(this.rating);
    this.onTouched();
  }

  writeValue(rating: number): void {
    if (!this.disabled) {
      console.log('writeValue', rating);
      this.rating = rating;
      this.setStarsArray();
    }
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched');
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    console.log('setDisabledState');
  }
}

```

```html
<!-- rating-component-new.component.html -->
<p>rating-component-new works!</p>
<div [ngClass]="{ disabled: disabled }">
  <div
    class="star-container"
    [attr.tabindex]="0"
    *ngFor="let star of stars; let i = index"
    (click)="onStarClick(star, i)"
    (keydown.enter)="onStarClick(star, i)"
  >
    <ng-container *ngIf="star">⭐</ng-container>
    <ng-container *ngIf="!star">.</ng-container>
  </div>
</div>

```