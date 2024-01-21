---
layout: example.11ty.cjs
title: <slot-machine> ⌲ Examples ⌲ Basic
tags: example
name: Basic
description: A basic example
---

<style>
  slot-machine p {
    border: solid 1px blue;
    padding: 8px;
  }
</style>
<slot-machine>
  <p>This is child content</p>
</slot-machine>

<h3>CSS</h3>

```css
p {
  border: solid 1px blue;
  padding: 8px;
}
```

<h3>HTML</h3>

```html
<slot-machine>
  <p>This is child content</p>
</slot-machine>
```
