---
layout: page.11ty.cjs
title: <slot-machine> ⌲ Home
---

# &lt;slot-machine>

`<slot-machine>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<slot-machine>` is just an HTML element. You can it anywhere you can use HTML!

```html
<slot-machine></slot-machine>
```

  </div>
  <div>

<slot-machine></slot-machine>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<slot-machine>` can be configured with attributed in plain HTML.

```html
<slot-machine name="HTML"></slot-machine>
```

  </div>
  <div>

<slot-machine name="HTML"></slot-machine>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<slot-machine>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;slot-machine&gt;</h2>
    <slot-machine .name=${name}></slot-machine>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;slot-machine&gt;</h2>
<slot-machine name="lit-html"></slot-machine>

  </div>
</section>
