dom
===
A collection of DOM Helpers


## API
- [`vendorPrefix()`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/vendorPrefix.js) - Detect Vendor Prefix.
- [`getScrollbarWidth(): number`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/getScrollbarWidth.js) - Get browser Scrollbar width.
- [`reflow(elem: Element)`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/reflow.js) - Force reflow.
- [`cssText(style: Object): string`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/cssText.js) - Convert style object to css text.
- [`isVisible(elem: Element): boolean`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/isVisible.js) - Check the element is visible.

**selector**

- [`byId(string): Element|null`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/byId.js) - Alias **document.getElementById**
- [`qsa(selectors): Element[]`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/qsa.js) - Better **querySelectorAll**.
- [`matches(elem, selector): boolean`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/matches.js) - Check the element is selected by the selector.
- [`contains(parent, child): boolean`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/contains.js) - Check the child is a descendant of parent.
- [`closest(elem, selector): Element`](https://github.com/takumiao13/js-wheels/tree/master/packages/dom/src/closest.js) - Traverse parents of the element until it finds a node that matches the selector.