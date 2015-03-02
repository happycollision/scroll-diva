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
      function snapToBottom() {
        // Pushes the element to to bottom of parent
        var newTopMargin = parentHeight - shavedHeight - originalPos.top;
        $el.css({
          position: 'relative', 
          marginTop: newTopMargin,
          bottom: 'auto',
          left: 'auto',
          top: 'auto',
          width: ''
        });
      }
      function pinToBottom(){
        // pins element to bottom of viewport
        
        $el.css({
          position: 'fixed', 
          bottom: 0, 
          left: originalOffset.left - borderWidth - originalLeftMargin,
          top: 'auto',
          marginTop: originalTopMargin
        });
      }
      function pinToTop(){
        // pins element to top of viewport
        //console.log('hello pin');
        //console.log(borderWidth);
        //console.log(originalOffset.left);
        $el.css({
          position: 'fixed', 
          bottom: 'auto', 
          left: originalOffset.left - borderWidth - originalLeftMargin,
          top: 0,
          marginTop: originalTopMargin,
          width: originalWidth
        });
      }
      function snapToTop(){
        // AKA set to original position
        //console.log('hello snap');
        $el.css({
          position: 'relative', 
          marginTop: originalTopMargin,
          bottom: 'auto',
          left: 'auto',
          top: 'auto',
          width: ''
        });
      }
      function resetCss(){
        $el.css({
          position: '', 
          marginTop: '',
          bottom: '',
          left: '',
          top: '',
          width: ''
        });
      }

      // Set the data for custom selector
      $(this).data('scrollDiva',true);
      
      var $el = $(this);
      var $window = $(window);
      var $parent = $el.parent();
      
      if ($parent.css('position') === 'static'){
        // Set the parent position to relative
        // This way we can get the child element's
        // position offset from the parent, not from
        // the whole document
        $parent.css('position', 'relative');
      }

      var fullHeight = $el.outerHeight(true);
      var borderWidth = parseInt($el.css('borderLeftWidth'));
      var originalTopMargin = parseInt($el.css('marginTop'));
      var originalLeftMargin = parseInt($el.css('marginLeft'));
      var originalPos = $el.position();
      var originalOffset = $el.offset();
      var originalWidth = $el.outerWidth();
      var shavedHeight = fullHeight - originalTopMargin;
      var parentTopPos = $parent.offset().top;
      var parentHeight = $parent.height();
      var parentBottomPos = parentTopPos + parentHeight;
      var viewportHeight = $(window).height();
      var playableHeight = parentHeight - originalPos.top - fullHeight;
      
/*
      markerCss = {
	  	  position: 'absolute',
	  	  height: 0,
	  	  width: '100%',
	  	  border: 'none',
	  	  padding: 0,
	  	  maxWidth: '100%',
	  	  minWidth: '100%',
	  	  minHeight: 0,
	  	  height: 1,
	  	  backgroundColor: '#fff'
      };
      
      apexTopMarker = $('<div></div>').css(markerCss).css('top',originalPos.top);
      apexBottomMarker = $('<div></div>').css(markerCss).css('top',originalPos.top + fullHeight);
      baseTopMarker = $('<div></div>').css(markerCss).css('top',originalPos.top + playableHeight);
      baseBottomMarker = $('<div></div>').css(markerCss).css('top',originalPos.top + playableHeight + fullHeight);

      $parent.append(apexTopMarker);
      $parent.append(apexBottomMarker);
      $parent.append(baseTopMarker);
      $parent.append(baseBottomMarker);
*/
      
      function placeElement(){
        var elTopPos = parseInt($window.scrollTop() - originalOffset.top + originalTopMargin + borderWidth);
        if (elTopPos > 0) { pinToTop(); }
        if (elTopPos <= 0 && elTopPos < playableHeight) { snapToTop(); }
        if (elTopPos >= playableHeight) { snapToBottom(); }
      }
      
      placeElement();
      
      $window.scroll(placeElement);
      
      $window.on('resize',function(){
        $window.off();
        resetCss();
        $el.scrollDiva();
      });
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