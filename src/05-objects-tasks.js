/* eslint max-classes-per-file: ["error", 2] */

/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return new proto.constructor(...Object.values(obj));
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Combine {
  constructor(string1, combinator, string2) {
    this.result = `${string1} ${combinator} ${string2}`;
  }

  stringify() {
    return this.result;
  }
}

class CSS {
  constructor() {
    this.Element = '';
    this.Id = '';
    this.Class = [];
    this.Attr = [];
    this.PseudoClass = [];
    this.PseudoElement = '';
  }

  element(value) {
    if (this.Element.length) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (
      this.Id.length
      || this.Class.length
      || this.Attr.length
      || this.PseudoClass.length
      || this.PseudoElement
    ) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.Element = value;
    return this;
  }

  id(value) {
    if (this.Id.length) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (
      this.Class.length
      || this.Attr.length
      || this.PseudoClass.length
      || this.PseudoElement
    ) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.Id = `#${value}`;
    return this;
  }

  class(value) {
    if (this.Attr.length || this.PseudoClass.length || this.PseudoElement) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.Class.push(`.${value}`);
    return this;
  }

  attr(value) {
    if (this.PseudoClass.length || this.PseudoElement) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.Attr.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (this.PseudoElement) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.PseudoClass.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.PseudoElement !== '') {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.PseudoElement = `::${value}`;
    return this;
  }

  stringify() {
    let result = '';
    result += this.Element;
    result += this.Id;
    this.Class.forEach((el) => {
      result += el;
    });
    this.Attr.forEach((el) => {
      result += el;
    });
    this.PseudoClass.forEach((el) => {
      result += el;
    });
    result += this.PseudoElement;
    return result;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const builder = new CSS();
    return builder.element(value);
  },

  id(value) {
    const builder = new CSS();
    return builder.id(value);
  },

  class(value) {
    const builder = new CSS();
    return builder.class(value);
  },

  attr(value) {
    const builder = new CSS();
    return builder.attr(value);
  },

  pseudoClass(value) {
    const builder = new CSS();
    return builder.pseudoClass(value);
  },

  pseudoElement(value) {
    const builder = new CSS();
    return builder.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Combine(
      selector1.stringify(),
      combinator,
      selector2.stringify(),
    );
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
