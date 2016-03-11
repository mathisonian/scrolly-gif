
var SuperGif = require('../lib/lib-gif');


console.log(SuperGif);


module.exports = function(elt) {

  var rect = elt.getBoundingClientRect();
  var gif = SuperGif({ gif: elt, auto_play: false });

  var height = rect.bottom - rect.top;

  var absoluteTop = rect.top + window.scrollY;
  var absoluteBottom = rect.bottom + window.scrollY;
  var absolutePosition = rect.top + window.scrollY + height / 2;

  gif.load(function() {
    gif.move_to(0);
    var gifLength = gif.get_length();

    window.addEventListener('scroll', function(e) {
      // calculate current position based on scroll position
      var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var scrollY = window.scrollY;

      if((absoluteBottom - scrollY) >= windowHeight || (absoluteBottom - scrollY) <= 0) {
        return;
      } else {
        var position = (windowHeight - height) - (absoluteTop - scrollY);
        position /= (windowHeight - height);
        var mappedIndex = position * gifLength;
        mappedIndex = Math.min(Math.round(mappedIndex), gifLength - 1);
        gif.move_to(mappedIndex);
      }
    });
  });
}
