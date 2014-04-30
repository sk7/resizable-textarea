var ev = require('event')
  , Emitter = require('emitter')
  , style = require('computed-style')
  , emptyLineReg = /(^|\n|\r|\n\r)$/g
  , styleList = [
      'font-size'
    , 'font-style'
    , 'font-weight'
    , 'font-family'
    , 'line-height'
    , 'text-transform'
    , 'letter-spacing'
    , 'width'
    , 'padding-top'
    , 'padding-right'
    , 'padding-bottom'
    , 'padding-left'
    , 'box-sizing'
  ]
;

function duplicateStyles(dup, el) {
  var i = 0
    , l = styleList.length
  ;
  while (i < l) {
    dup.style[styleList[i]] = style(el)[styleList[i]];
    i += 1;
  }
}

module.exports = function (element, options) {
  Emitter(element);
  options = options || {};

  var duplicate = document.createElement('div')
    , min = options.min || 20
    , max = options.max || Infinity
  ;

  duplicate.className = 'resizable-textarea';

  duplicateStyles(duplicate, element);
  document.body.appendChild(duplicate);

  function resize() {

    // If the last line is empty, then add in a space to match textarea
    duplicate.textContent = element.value.replace(emptyLineReg, '$1&nbsp;');

    var height = parseInt(style(duplicate).height, 10);
    var new_height = Math.max(min, Math.min(max, height)) + 'px';
    var old_height = element.style.height;

    if ( old_height != new_height) {
      element.style.height = new_height;
      diff = parseInt(new_height.substring(0, new_height.length-2)) - parseInt(old_height.substring(0, old_height.length-2));
      element.emit('resize',  diff);
    }
  }

  ev.bind(element, 'input', resize);

  // set the minimum size
  element.style.height = min + 'px';

  // initiate textarea to correct size
  resize();
  
  // reference resize function for manually triggering
  return resize;

};
