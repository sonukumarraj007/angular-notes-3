# Specificity

Specificity is a weight that is applied to a given CSS declaration, determined by the number of each selector type in the matching selector. When multiple declarations have equal specificity, the last declaration found in the CSS is applied to the element. Specificity only applies when the same element is targeted by multiple declarations. As per CSS rules, directly targeted elements will always take precedence over rules which an element inherits from its ancestor.

> Note: Proximity of elements in the document tree has no effect on the specificity.

## Selector Types

The following list of selector types increases by specificity:

Type selectors (e.g., h1) and pseudo-elements (e.g., ::before).

Class selectors (e.g., .example), attributes selectors (e.g., [type="radio"]) and pseudo-classes (e.g., :hover).

ID selectors (e.g., #example).

Universal selector (\*), combinators (+, >, ~, ' ', ||) and negation pseudo-class (:not()) have no effect on specificity. (The selectors declared inside :not() do, however.)

Inline styles added to an element (e.g., style="font-weight: bold;") always overwrite any styles in external stylesheets, and thus can be thought of as having the highest specificity.

## The !important exception

When an important rule is used on a style declaration, this declaration overrides any other declarations. Although technically !important has nothing to do with specificity, it interacts directly with it. Using !important, however, is bad practice and should be avoided because it makes debugging more difficult by breaking the natural cascading in your stylesheets. When two conflicting declarations with the !important rule are applied to the same element, the declaration with a greater specificity will be applied.

### Instead of using !important, consider:

Make better use of the CSS cascade

Use more specific rules. By indicating one or more elements before the element you're selecting, the rule becomes more specific and gets higher priority:

```html
<div id="test">
    <span>Text</span>
</div>
```

```css
div#test span {
    color: green;
}
div span {
    color: blue;
}
span {
    color: red;
}
```

No matter the order, text will be green because that rule is most specific. (Also, the rule for blue overwrites the rule for red, notwithstanding the order of the rules)

As a nonsense special case for (2), duplicate simple selectors to increase specificity when you have nothing more to specify.

```css
#myId#myId span {
    color: yellow;
}
.myClass.myClass span {
    color: orange;
}
```
