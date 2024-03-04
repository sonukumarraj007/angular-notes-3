## Native deep cloning
It's called "structured cloning", works experimentally in Node 11 and later, and hopefully will land in browsers. See this answer for more details.

## Fast cloning with data loss - JSON.parse/stringify
If you do not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within your object, a very simple one liner to deep clone an object is:

JSON.parse(JSON.stringify(object))

``` javascript
const a = {
  string: 'string',
  number: 123,
  bool: false,
  nul: null,
  date: new Date(),  // stringified
  undef: undefined,  // lost
  inf: Infinity,  // forced to 'null'
  re: /.*/,  // lost
}
console.log(a);
console.log(typeof a.date);  // Date object
const clone = JSON.parse(JSON.stringify(a));
console.log(clone);
console.log(typeof clone.date);  // result of .toISOString()
```

## Reliable cloning using a library
Since cloning objects is not trivial (complex types, circular references, function etc.), most major libraries provide function to clone objects. Don't reinvent the wheel - if you're already using a library, check if it has an object cloning function. For example,

lodash - cloneDeep; can be imported separately via the lodash.clonedeep module and is probably your best choice if you're not already using a library that provides a deep cloning function
AngularJS - angular.copy
jQuery - jQuery.extend(true, { }, oldObject); .clone() only clones DOM elements

## ES6
For completeness, note that ES6 offers two shallow copy mechanisms: Object.assign() and the spread operator.


## JSON.stringify
JSON.stringify() converts a value to JSON notation representing it:

- If the value has a toJSON() method, it's responsible to define what data will be serialized.
Boolean, Number, and String objects are converted to the corresponding primitive values during stringification, in accord with the traditional conversion semantics.
- undefined, Functions, and Symbols are not valid JSON values. If any such values are encountered during conversion they is either omitted (when found in an object) or changed to null (when found in an array). JSON.stringify() can return undefined when passing in "pure" values like JSON.stringify(function(){}) or JSON.stringify(undefined).
- All Symbol-keyed properties will be completely ignored, even when using the replacer function.
The instances of Date implement the toJSON() function by returning a string (the same as date.toISOString()). Thus, they are treated as strings.
- The numbers Infinity and NaN, as well as the value null, are all considered null.
All the other Object instances (including Map, Set, WeakMap, and WeakSet) will have only their enumerable properties serialized.

``` javascript
JSON.stringify({});                    // '{}'
JSON.stringify(true);                  // 'true'
JSON.stringify('foo');                 // '"foo"'
JSON.stringify([1, 'false', false]);   // '[1,"false",false]'
JSON.stringify([NaN, null, Infinity]); // '[null,null,null]'
JSON.stringify({ x: 5 });              // '{"x":5}'

JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)) 
// '"2006-01-02T15:04:05.000Z"'

JSON.stringify({ x: 5, y: 6 });
// '{"x":5,"y":6}'
JSON.stringify([new Number(3), new String('false'), new Boolean(false)]);
// '[3,"false",false]'

// String-keyed array elements are not enumerable and make no sense in JSON
let a = ['foo', 'bar'];
a['baz'] = 'quux';      // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
JSON.stringify(a); 
// '["foo","bar"]'

JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }); 
// '{"x":[10,null,null,null]}' 

// Standard data structures
JSON.stringify([new Set([1]), new Map([[1, 2]]), new WeakSet([{a: 1}]), new WeakMap([[{a: 1}, 2]])]);
// '[{},{},{},{}]'

// TypedArray
JSON.stringify([new Int8Array([1]), new Int16Array([1]), new Int32Array([1])]);
// '[{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Uint8Array([1]), new Uint8ClampedArray([1]), new Uint16Array([1]), new Uint32Array([1])]);
// '[{"0":1},{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Float32Array([1]), new Float64Array([1])]);
// '[{"0":1},{"0":1}]'
 
// toJSON()
JSON.stringify({ x: 5, y: 6, toJSON(){ return this.x + this.y; } });
// '11'

// Symbols:
JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
// '{}'
JSON.stringify({ [Symbol('foo')]: 'foo' });
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]);
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function(k, v) {
  if (typeof k === 'symbol') {
    return 'a symbol';
  }
});
// undefined

// Non-enumerable properties:
JSON.stringify( Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }) );
// '{"y":"y"}'


// BigInt values throw
JSON.stringify({x: 2n});
// TypeError: BigInt value can't be serialized in JSON
```
