
#### Window.customElements
- Returns a reference to the CustomElementRegistry object

Mapping
A custom element hosts an Angular component, providing a bridge between the data and logic defined in the component and standard DOM APIs. Component properties and logic maps directly into HTML attributes and the browser's event system.

The creation API parses the component looking for input properties, and defines corresponding attributes for the custom element. It transforms the property names to make them compatible with custom elements, which do not recognize case distinctions. The resulting attribute names use dash-separated lowercase. For example, for a component with @Input('myInputProp') inputProp, the corresponding custom element defines an attribute my-input-prop.

Component outputs are dispatched as HTML Custom Events, with the name of the custom event matching the output name. For example, for a component with @Output() valueChanged = new EventEmitter(), the corresponding custom element dispatches events with the name "valueChanged", and the emitted data is stored on the event’s detail property. If you provide an alias, that value is used; for example, @Output('myClick') clicks = new EventEmitter<string>(); results in dispatch events with the name "myClick".
