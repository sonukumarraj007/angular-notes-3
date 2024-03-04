# Reactive Forms

Reactive forms provide a model-driven approach to handling form inputs
Reactive forms are created with the help of

1. FormGroup, FormControl and FormArray classes in typescript.
2. FormGroup, FormGroupName, FormControl, FormControlName, FormArray and FormArrayName directives in html

To use reactive forms, import ReactiveFormsModule from the @angular/forms package and add it to your NgModule's imports array.

e.g.

```typescript
// profile-editor.component.ts
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
    selector: 'app-profile-editor',
    templateUrl: './profile-editor.component.html',
    styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
    // profileForm = new FormGroup({
    //     firstName: new FormControl(''),
    //     lastName: new FormControl(''),
    //     address: new FormGroup({
    //         street: new FormControl(''),
    //         city: new FormControl(''),
    //         state: new FormControl(''),
    //         zip: new FormControl('')
    //     }),
    //     aliases: new FormArray([new FormControl('')])
    // });

    profileForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: [''],
        address: this.fb.group({
            street: [''],
            city: [''],
            state: [''],
            zip: ['']
        }),
        aliases: this.fb.array([this.fb.control('')])
    });

    get aliases() {
        return this.profileForm.get('aliases') as FormArray;
    }

    constructor(private fb: FormBuilder) {}

    updateProfile() {
        this.profileForm.patchValue({
            firstName: 'Nancy',
            address: {
                street: '123 Drew Street'
            }
        });
    }

    addAlias() {
        this.aliases.push(this.fb.control(''));
    }

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.profileForm.value);
    }
}
```

```html
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
    <label>
        First Name:
        <input type="text" formControlName="firstName" required />
    </label>

    <label>
        Last Name:
        <input type="text" formControlName="lastName" />
    </label>

    <div formGroupName="address">
        <h3>Address</h3>

        <label>
            Street:
            <input type="text" formControlName="street" />
        </label>

        <label>
            City:
            <input type="text" formControlName="city" />
        </label>

        <label>
            State:
            <input type="text" formControlName="state" />
        </label>

        <label>
            Zip Code:
            <input type="text" formControlName="zip" />
        </label>
    </div>

    <div formArrayName="aliases">
        <h3>Aliases</h3>
        <button (click)="addAlias()">Add Alias</button>

        <div *ngFor="let alias of aliases.controls; let i=index">
            <!-- The repeated alias template -->
            <label>
                Alias:
                <input type="text" [formControlName]="i" />
            </label>
        </div>
    </div>

    <button type="submit" [disabled]="!profileForm.valid">Submit</button>
</form>

<hr />

<p>
    Form Value: {{ profileForm.value | json }}
</p>

<p>
    Form Status: {{ profileForm.status }}
</p>

<p>
    <button (click)="updateProfile()">Update Profile</button>
</p>
```

## FormBuilder

The FormBuilder service provides convenient methods for generating controls.
