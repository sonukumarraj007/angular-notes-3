## toEqual vs toBe

> When comparing primitive types, toEqual() and toBe() will yield the same result. When comparing objects, toBe() is a stricter comparison, and if it is not the exact same object in memory this will return false. So unless you want to make sure it's the exact same object in memory, use toEqual() for comparing objects.

