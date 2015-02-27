/*
 * 
 * 
 *
 * Copyright (c) 2015 Don Denton
 * Licensed under the MIT license.
 */
(function ($) {
  // Collection method.
  $.fn.scrollDiva = function () {
    return this.each(function (i) {
      // Do something to each selected element.
      $(this).html('scrollDiva' + i);
    });
  };

  // Static method.
  $.scrollDiva = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.scrollDiva.options, options);
    // Return the name of your plugin plus a punctuation character.
    return 'scrollDiva' + options.punctuation;
  };

  // Static method default options.
  $.scrollDiva.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].scrollDiva = function (el) {
    return $(el).data('scrollDiva') === true;
  };
}(jQuery));