var ev = require('event')
  , style = require('computed-style')
  , emptyLineReg = /(\n|\r|\n\r)$/g
  , styleList = [
      'font-size'
    , 'font-style'
    , 'font-weight'
    , 'font-family'
    , 'line-height'
    , 'text-transform'
    , 'letter-spacing'
    , 'width'
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

  options = options || {};

  var duplicate = document.createElement('div')
    , min = options.min || 20
    , max = options.max || Infinity
  ;

  duplicate.className = 'resizable-textarea';

  duplicateStyles(duplicate, element);
  document.body.appendChild(duplicate);

  ev.bind(element, 'input', function () {
    
    // If the last line is empty, then add in a space to match textarea
    duplicate.textContent = element.value.replace(emptyLineReg, '$1&nbsp;');
    
    var height = parseInt(style(duplicate).height, 10);
    
    console.log(height);
    
    element.style.height = Math.max(min, Math.min(max, height)) + 'px';

  });

  // set the minimum rows
  element.style.height = min + 'px';

};
