JST
===
A JavaScript template engine.


## Examples
```js
var template = `
  <ul>
    <% for (var i = 0; i < data.length; i++) { %>
      <li>
        <%= data[i].name %>
        <%= data[i].age %>
      </li>
    <% } %>
  </ul>
`;

var data = [
  { name: 'John', age: 14 }, 
  { name: 'Bob', age: 16 }, 
  { name: 'Mike', age: 27 }
];

jst.render(template, data);
```

- Unbuffered code for conditionals etc `<% code %>`
- Escapes html by default with `<%= code %>`

## API
```js
jst.compile(tpl: string): Function

jst.render(tpl: string, data: Object): string
```

## Reference
- [underscore.template](https://github.com/jashkenas/underscore) - JavaScript's utility _ belt.
- [tj/ejs](https://github.com/tj/ejs) - Embedded JavaScript templates for node.