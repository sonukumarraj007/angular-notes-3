What type of forms have u used?

What is template driven forms ?

What is reactive forms ?

What is Reactive forms? Have you created any forms in application ? ng-Form

Can you tell the difference between template driven and reactive forms?

When we should reactive forms and when to use template driven forms?

FormBuilders, Form Groups, FormControls
Control Value Accessor

Custom Validation in Form
How do you do validation on any form ?
How to do validation in template driven form or display and error for a field?

What is ng-pristine, ng-dirty ?

# Forms

Angular provides two different approaches to handling user input through forms: reactive and template-driven.

<table>
    <thead>
        <tr>
            <th></th>
            <th>Reactive</th>
            <th>Template-driven</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Setup (form model)</td>
            <td>More explicit, created in component class</td>
            <td>Less explicit, created by directives</td>
        </tr>
        <tr>
            <td>Data model</td>
            <td>Structured</td>
            <td>Unstructured</td>
        </tr>
        <tr>
            <td>Predictability</td>
            <td>Synchronous</td>
            <td>Asynchronous</td>
        </tr>
        <tr>
            <td>Form validation</td>
            <td>Functions</td>
            <td>Directives</td>
        </tr>
        <tr>
            <td>Mutability</td>
            <td>Immutable</td>
            <td>Mutable</td>
        </tr>
        <tr>
            <td>Scalability</td>
            <td>Low-level API access</td>
            <td>Abstraction on top of APIs</td>
        </tr>
    </tbody>
</table>

## Common foundation

Both reactive and template-driven forms share underlying building blocks.

1. FormControl tracks the value and validation status of an individual form control.

2. FormGroup tracks the same values and status for a collection of form controls.

3. FormArray tracks the same values and status for an array of form controls.

4. ControlValueAccessor creates a bridge between Angular FormControl instances and native DOM elements.

## Control status CSS classes

Like in AngularJS, Angular automatically mirrors many control properties onto the form control element as CSS classes. You can use these classes to style form control elements according to the state of the form. The following classes are currently supported:

.ng-valid

.ng-invalid

.ng-pending // this class gets applied when async validator are used and they are not resolved yet

.ng-pristine

.ng-dirty

.ng-untouched

.ng-touched


<table>
    <tbody>
        <tr>
            <th>
                State
            </th>
            <th>
                Class if true
            </th>
            <th>
                Class if false
            </th>
        </tr>
        <tr>
            <td>
                The control has been visited.
            </td>
            <td>
                <code>ng-touched</code>
            </td>
            <td>
                <code>ng-untouched</code>
            </td>
        </tr>
        <tr>
            <td>
                The control's value has changed.
            </td>
            <td>
                <code>ng-dirty</code>
            </td>
            <td>
                <code>ng-pristine</code>
            </td>
        </tr>
        <tr>
            <td>
                The control's value is valid.
            </td>
            <td>
                <code>ng-valid</code>
            </td>
            <td>
                <code>ng-invalid</code>
            </td>
        </tr>
    </tbody>
</table>
