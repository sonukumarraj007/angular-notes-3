## Inheritance Class

```javascript
function Person(first, last, age, gender, interests) {
  this.name = {
    first,
    last
  };
  this.age = age;
  this.gender = gender;
  this.interests = interests;
};

Person.prototype.greeting = function() {
  console.log('Hi! I\'m ' + this.name.first + '.');
};

function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests);

  this.subject = subject;
}

Teacher.prototype = Object.create(Person.prototype);

Teacher.prototype.constructor = Teacher;
```

## Inheritance Object
```javascript
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

Object.setPrototypeOf(rabbit, animal);

animal.walks = true;

console.log(rabbit.jumps); // true
console.log(rabbit.eats); // true
console.log(rabbit.walks); // true

```