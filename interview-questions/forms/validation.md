# Form validation

## Reactive form validation

In a reactive form, the source of truth is the component class. Instead of adding validators through attributes in the template, you add validator functions directly to the form control model in the component class. Angular then calls these functions whenever the value of the control changes.

### Validator functions

There are two types of validator functions: sync validators and async validators.

-   Sync validators: functions that take a control instance and immediately return either a set of validation errors or null. You can pass these in as the second argument when you instantiate a FormControl.

-   Async validators: functions that take a control instance and return a Promise or Observable that later emits a set of validation errors or null. You can pass these in as the third argument when you instantiate a FormControl.

> Note: for performance reasons, Angular only runs async validators if all sync validators pass. Each must complete before errors are set.

```typescript
// reactive/hero-form-reactive.component.ts (validator functions)
ngOnInit(): void {
  this.heroForm = new FormGroup({
    'name': new FormControl(this.hero.name, [
      Validators.required,
      Validators.minLength(4),
      forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
    ]),
    'alterEgo': new FormControl(this.hero.alterEgo),
    'power': new FormControl(this.hero.power, Validators.required)
  });

}

get name() { return this.heroForm.get('name'); }

get power() { return this.heroForm.get('power'); }
```

```html
<!-- reactive/hero-form-reactive.component.html (name with error msg) -->
<input id="name" class="form-control" formControlName="name" required />

<div *ngIf="name.invalid && (name.dirty || name.touched)" class="alert alert-danger">
    <div *ngIf="name.errors.required">
        Name is required.
    </div>
    <div *ngIf="name.errors.minlength">
        Name must be at least 4 characters long.
    </div>
    <div *ngIf="name.errors.forbiddenName">
        Name cannot be Bob.
    </div>
</div>
```

## Custom validators

```typescript
// shared/forbidden-name.directive.ts (forbiddenNameValidator)
/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
}
```

### Adding to template-driven forms

```typescript
// shared/forbidden-name.directive.ts (directive)
@Directive({
    selector: '[appForbiddenName]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})
export class ForbiddenValidatorDirective implements Validator {
    @Input('appForbiddenName') forbiddenName: string;

    validate(control: AbstractControl): { [key: string]: any } | null {
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control) : null;
    }
}
```

```html
<!-- template/hero-form-template.component.html (forbidden-name-input) -->
<input id="name" name="name" class="form-control" required minlength="4" appForbiddenName="bob" [(ngModel)]="hero.name" #name="ngModel" />
```

> You may have noticed that the custom validation directive is instantiated with useExisting rather than useClass. The registered validator must be this instance of the ForbiddenValidatorDirective—the instance in the form with its forbiddenName property bound to “bob". If you were to replace useExisting with useClass, then you’d be registering a new class instance, one that doesn’t have a forbiddenName.

## Cross field validation

```typescript
const heroForm = new FormGroup(
    {
        name: new FormControl(),
        alterEgo: new FormControl(),
        power: new FormControl()
    },
    { validators: identityRevealedValidator }
);
```

```typescript
/** A hero's name can't match the hero's alter ego */
export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const name = control.get('name');
    const alterEgo = control.get('alterEgo');

    return name && alterEgo && name.value === alterEgo.value ? { identityRevealed: true } : null;
};
```

```html
<div *ngIf="heroForm.errors?.identityRevealed && (heroForm.touched || heroForm.dirty)" class="cross-validation-error-message alert alert-danger">
    Name cannot match alter ego.
</div>
```

### Adding to template driven forms

```typescript
// shared/identity-revealed.directive.ts
@Directive({
    selector: '[appIdentityRevealed]',
    providers: [{ provide: NG_VALIDATORS, useExisting: IdentityRevealedValidatorDirective, multi: true }]
})
export class IdentityRevealedValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors {
        return identityRevealedValidator(control);
    }
}
```
