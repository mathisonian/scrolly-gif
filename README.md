# scrolly-gif
Animate a gif as the user scrolls the page

This is mostly a wrapper around https://github.com/buzzfeed/libgif-js

Examples: http://mathisonian.github.io/scrolly-gif/

## install

```
npm install scrolly-gif
```

## usage

```js
var scrollyGif = require('scrolly-gif');

// simple:
scrollyGif(document.getElementById('my-gif-element'));

// or with jquery:
$('img.scrolly-gif').each(function() {
   scrollyGif(this);
});
```
