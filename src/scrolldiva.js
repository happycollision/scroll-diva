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
    
    var $window = $(window);
    var viewportHeight = $window.height();

    return this.each(function () {
      
      var $el = $(this);
      var $wrap; // Will be defined in createWrap()
      var lastScroll = $window.scrollTop();
      var states = {
        // Positions:
        scrollDirection: 'neutral', // up, down
        scrollPos: 'unknown',
        elRelativeToWrap: 'unknown', // top, middle, bottom
        wrapState: {
          top: 'unknown', // above, in, below
          bottom: 'unknown', // above, in, below
        },
        elState: {
          top: 'unknown', // above, in, below
          bottom: 'unknown', // above, in, below
        },
        
        // Sizes:
        elSmallerThanWrap: 'unknown', // boolean
        elSmallerThanViewport: 'unknown',
        wrapLargerThanViewport: 'unknown', // boolean
        elHeight: 'unknown', // height with borders
        wrapHeight: 'unknown', // fillable height

        // How much of the element fits in the current
        // in-view portion of the wrap?
        percentHeightAvailable: 'unknown', // 
      };

      function roundCss(jqObj,property){
        return Math.floor(parseInt(jqObj.css(property), 10)); 
      }
      
      function createWrap() {
        var $parent = $el.parent();

        if ($parent.hasClass('scroll-diva-wrapper')){
          killWrap();
          createWrap();
          return;
        }
        
        if ($parent.css('position') === 'static'){
          // Set the parent position to relative
          // This way we can get the child element's
          // position offset from the parent, not from
          // the whole document
          $parent.css('position', 'relative');
        }

        var margins = roundCss($el, 'marginTop') + roundCss($el, 'marginBottom');
        var playableHeight = $parent.innerHeight() - $el.position().top - margins
        
        // Wrap was already defined so it is available in the larger scope.
        $wrap = $('<div class="scroll-diva-wrapper"></div>');        
        $wrap.css({
          position: 'relative',
          height: playableHeight,
          width: $el.outerWidth(),
          padding: 0,
          float: $el.css('float'),
          marginLeft: roundCss($el,'marginLeft'),
          marginTop: roundCss($el,'marginTop'),
          marginRight: roundCss($el,'marginRight'),
          marginBottom: roundCss($el,'marginBottom'),
          backgroundColor: '#696'
        });
        
        $el.css({margin:0, width: '100%'}).wrap($wrap);
        $wrap = $el.parent();
      }
      
      function pushDown() {
        var offTopBy = $window.scrollTop() - $el.offset().top + roundCss($wrap,'marginTop');
        if( offTopBy > 0 ){
          // $el.css('margin-top', function (index, curValue) {
          //   return parseInt(curValue, 10) + offTopBy + 'px';
          // });
          $el.stop();
          $el.animate({marginTop: '+=' + offTopBy},{easing: 'swing', duration: 200});
        }
      }
      
      function pullDown() {
        var offBottomBy = $window.scrollTop() - $el.offset().top - states.elHeight - roundCss($el.parent(),'marginBottom') + $window.height();
        var beyondContainer = $el.outerHeight(true) + offBottomBy >= states.wrapHeight;
        if (beyondContainer) {
          $el.stop();
          $el.animate({marginTop: states.wrapHeight - $el.outerHeight()});
          return;
        }
        if ( offBottomBy > 0 ){
          // $el.css('margin-top', function (index, curValue) {
          //   return parseInt(curValue, 10) + offTopBy + 'px';
          // });
          $el.stop();
          $el.animate({marginTop: '+=' + offBottomBy},{easing: 'swing', duration: 200});
          return;
        }
      }

      function pullUp() {
        var offTopBy = $el.offset().top - $window.scrollTop() - roundCss($wrap, 'marginTop');
        var beyondContainer = parseInt($el.css('marginTop')) - offTopBy <= 0;
        if (beyondContainer) {
          $el.stop();
          $el.animate({marginTop: 0});
          return;
        }
        if ( offTopBy > 0 ){
          // $el.css('margin-top', function (index, curValue) {
          //   return parseInt(curValue, 10) + offTopBy + 'px';
          // });
          $el.stop();
          $el.animate({marginTop: '-=' + offTopBy},{easing: 'swing', duration: 200});
          return;
        }
      }

      function center() {
        var elCenter = $el.offset().top + states.elHeight/2;
        var viewportCenter = $window.scrollTop() +viewportHeight / 2;
        var aboveCenterBy = viewportCenter - elCenter;
        if ( $el.outerHeight(true) + aboveCenterBy > states.wrapHeight ) {
          pullDown();
        } else if ( parseInt($el.css('marginTop')) + aboveCenterBy < 0 ){
          pullUp();
        } else {
          $el.stop();
          $el.animate({marginTop: '+=' + aboveCenterBy},{easing: 'swing', duration: 200});
        }
      }
      
      function killWrap() {
        if($el.parent().hasClass('scroll-diva-wrapper')){
          $el.unwrap();
          killWrap();          
        }
      }
      
      function snapToBottom() {
        // Pushes the element to to bottom of parent
        var newTopMargin = states.wrapHeight - states.elHeight;
        $el.css({
          position: 'relative', 
          marginTop: newTopMargin,
        });
      }
      
      function pinToBottom() {
        // pins element to bottom of viewport
        
        $el.css({
          position: 'fixed', 
          bottom: 0, 
          left: $el.offset().left,
          top: 'auto'
        });
      }
      
      function pinToTop() {
        // pins element to top of viewport
        $el.css({
          position: 'fixed', 
          bottom: 'auto', 
          left: $el.offset().left,
          top: 0,
          marginTop: roundCss($wrap, 'marginTop'),
          width: roundCss($wrap, 'width')
        });
      }
      
      function snapToTop() {
        // AKA set to original position
        //console.log('hello snap');
        $el.css({
          position: 'relative', 
          marginTop: 0,
        });
      }
      
      function resetCss() {
        $el.removeAttr('style');
      }

      function sizeStates(){
        if ($el.outerHeight() < $wrap.height()) {
          states.elSmallerThanWrap = true;
        } else {
          states.elSmallerThanWrap = false;
        }
        if ($wrap.height() >= viewportHeight) {
          // UI wise, greater than or exactly the same are essentially equal
          states.wrapLargerThanViewport = true;
        } else {
          states.wrapLargerThanViewport = false;
        }
        
        states.elHeight = $el.outerHeight();
        states.wrapHeight = $wrap.height();

        if (states.elHeight <= viewportHeight){
          states.elSmallerThanViewport = true;
        } else {
          states.elSmallerThanViewport = false;
        }
      }
      
      function positionStates() {
        states.scrollPos = $window.scrollTop();

        if (states.scrollPos > lastScroll) {
          states.scrollDirection = 'down';
        } else if (states.scrollPos < lastScroll) {
          states.scrollDirection = 'up';
        } else {
          states.scrollDirection = 'neutral';
        }
        lastScroll = states.scrollPos;
                
        if ($el.offset().top === $wrap.offset().top) {
          states.elRelativeToWrap = 'top';
        } else if ($el.offset().top === ($wrap.offset().top + states.wrapHeight - states.elHeight)){
          states.elRelativeToWrap = 'bottom';
        } else if (
          $el.offset().top > $wrap.offset().top &&
          $el.offset().top < ($wrap.offset().top - states.wrapHeight + states.elHeight)
        ){
          states.elRelativeToWrap = 'middle';
        } else {
          states.elRelativeToWrap = 'error';

          //throw 'State of scroll-diva\'s position is undetermined or out of range';
        }
                
        if (states.scrollPos > $wrap.offset().top){
          // wrap top above viewport
          states.wrapState.top = 'above';
        } else if (states.scrollPos < $wrap.offset().top - viewportHeight) {
          // wrap top is below viewport
          states.wrapState.top = 'below';
        } else {
          // wrap top is in view
          states.wrapState.top = 'in';
        }
        
        if (states.scrollPos > $wrap.offset().top + $wrap.height()){
          // wrap bottom above viewport
          states.wrapState.bottom = 'above';
        } else if (states.scrollPos < ($wrap.offset().top + $wrap.height()) - viewportHeight) {
          // wrap bottom is below viewport
          states.wrapState.bottom = 'below';
        } else {
          // wrap bottom is in view
          states.wrapState.bottom = 'in';
        }
        
        if (states.scrollPos > $el.offset().top){
          // wrap top above viewport
          states.elState.top = 'above';
        } else if (states.scrollPos < $el.offset().top - viewportHeight) {
          // wrap top is below viewport
          states.elState.top = 'below';
        } else {
          // wrap top is in view
          states.elState.top = 'in';
        }
        
        if (states.scrollPos > $el.offset().top + $el.outerHeight()){
          // wrap bottom above viewport
          states.elState.bottom = 'above';
        } else if (states.scrollPos < ($el.offset().top + $el.outerHeight()) - viewportHeight) {
          // wrap bottom is below viewport
          states.elState.bottom = 'below';
        } else {
          // wrap bottom is in view
          states.elState.bottom = 'in';
        }
      }
      
      function percentHeight(){
        var pxInView = 0;
        if ( 
          states.wrapState.top.match(/^(in)$/) && 
          states.wrapState.bottom.match(/^(in|below)$/) 
        ){
          pxInView = states.scrollPos + viewportHeight - $wrap.offset().top;
        } 
        else if (
          states.wrapState.top.match(/^(in|above)$/) && 
          states.wrapState.bottom.match(/^(in)$/) 
        ){
          pxInView = ($wrap.offset().top + states.wrapHeight) - states.scrollPos;
        }
        else if (
          states.wrapState.top === 'above' &&
          states.wrapState.bottom === 'below'
        ){
          pxInView = viewportHeight;
        }
        states.percentHeightAvailable = pxInView / states.elHeight * 100;
      }
      
      function setStates() { sizeStates(); positionStates(); percentHeight(); }
      
      function mover(){
        setStates();
        if (states.elSmallerThanWrap === false) {
          // Nothing to do.
          return;
        }
        
        if (states.elSmallerThanViewport) {
          center(); return;
        }
        
        if (states.scrollDirection === 'neutral'){
          //TODO: figure this out. It would happen if page
          // loads in the middle of the view
          center(); return;
        }

        if (
          states.scrollDirection === 'down' &&
          states.elState.bottom.match(/^(above|in)$/)
        ){
          pullDown(); return;
        }

        if (
          states.scrollDirection === 'up' &&
          states.elState.top.match(/^(below|in)$/)
        ){
          pullUp(); return;
        }
      }
      
      // Set the data for custom selector
      $(this).data('scroll-diva',true);
      
      createWrap();
      mover();

      $window.scroll(function(){
        mover();
      });
      $window.on('resize',function(){
        resetCss();
        killWrap();
        $window.off();
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
    return $(el).data('scroll-diva') === true;
  };
}(jQuery));