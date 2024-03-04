## Testing reactive forms

### data flow from view to model.

```typescript
// Favorite color test - view to model
it('should update the value of the input field', () => {
    const input = fixture.nativeElement.querySelector('input');
    const event = createNewEvent('input');

    input.value = 'Red';
    input.dispatchEvent(event);

    expect(fixture.componentInstance.favoriteColorControl.value).toEqual('Red');
});
```

Here are the steps performed in the view to model test.

1. Query the view for the form input element, and create a custom "input" event for the test.
2. Set the new value for the input to Red, and dispatch the "input" event on the form input element.
3. Assert that the component's favoriteColorControl value matches the value from the input.

### data flow from model to view.

```typescript
// Favorite color test - model to view
it('should update the value in the control', () => {
    component.favoriteColorControl.setValue('Blue');

    const input = fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('Blue');
});
```

Here are the steps performed in the model to view test.

1. Use the favoriteColorControl, a FormControl instance, to set the new value.
2. Query the view for the form input element.
3. Assert that the new value set on the control matches the value in the input.

## Testing template driven forms

### data flow from view to model.

```typescript
// Favorite color test - view to model
it('should update the favorite color in the component', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');
    const event = createNewEvent('input');

    input.value = 'Red';
    input.dispatchEvent(event);

    fixture.detectChanges();

    expect(component.favoriteColor).toEqual('Red');
}));
```

Here are the steps performed in the view to model test.

1. Query the view for the form input element, and create a custom "input" event for the test.
2. Set the new value for the input to Red, and dispatch the "input" event on the form input element.
3. Run change detection through the test fixture.
4. Assert that the component favoriteColor property value matches the value from the input.

### data flow from model to view.

```typescript
// Favorite color test - model to view
it('should update the favorite color on the input field', fakeAsync(() => {
    component.favoriteColor = 'Blue';

    fixture.detectChanges();

    tick();

    const input = fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('Blue');
}));
```

Here are the steps performed in the model to view test.

1. Use the component instance to set the value of the favoriteColor property.
2. Run change detection through the test fixture.
3. Use the tick() method to simulate the passage of time within the fakeAsync() task.
4. Query the view for the form input element.
5. Assert that the input value matches the value of the favoriteColor property in the component instance.
