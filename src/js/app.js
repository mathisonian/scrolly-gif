

var hljs = require('highlight.js');
hljs.configure({
  // tabReplace: '  ', // 4 spaces
})

hljs.initHighlightingOnLoad();


var $ = require('jquery');
var scrollyGif = require('scrolly-gif');

$('.gif-example img').each(function() {
  scrollyGif(this);
});
