## in reactive form
valueChanges is an Observable so you can pipe pairwise to get the previous and next values in the subscription.

```typescript
import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {pairwise, startWith} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(){
    this.form = this.fb.group({ 
      example1: '',
      example2: ''
    });
    
    // No initial value. So it will only emit once 2 values entered.
    this.form.get('example1')
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log('PREV1', prev);
        console.log('NEXT1', next);
        console.log('----');
      });

    // Fill buffer with initial value.  Will emit immediately.
    this.form.get('example2')
      .valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log('PREV2', prev);
        console.log('NEXT2', next);
        console.log('----');
      });
  }
}

```

```html
<div class="container">
  <div class="row">
    <div class="col-sm-6">
      <form [formGroup]="form">
        <div class="form-group">
          <label for="example1">Example 1 (see console)</label>
          <input
            type="text"
            class="form-control"
            id="example1"
            formControlName="example1"
          />
        </div>
        <div class="form-group">
          <label for="example2">Example 2 (see console)</label>
          <input
            type="text"
            class="form-control"
            id="example2"
            formControlName="example2"
          />
        </div>
      </form>
    </div>
  </div>
</div>

```

## in template driven form
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'kar-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';

  textValue = '2';

  onChange(event) {
    console.log('PREV1', this.textValue);
    this.textValue = event;
    console.log('NEXT1', this.textValue);
    console.log('----');
  }
}
```
```html
<input type="text" class="from-control" [ngModel]="textValue" (ngModelChange)="onChange($event)">
```
