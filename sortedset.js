(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.SortedSet = factory();
  }
}(this, function() {
  "use strict";

  // Internal private array which holds actual set elements
  var setArray;

  // Constructor for the SortedSet class
  function SortedSet(initial) {
    if (arguments.length > 0) {
      setArray = [];
      for (var i = 0; i < initial.length; i++) {
	this.add(initial[i]);
      }
      setArray.sort(sortNumber);
    } else {
      setArray = [];
    }
  }

  // helper method to get numbers to sort correctly, from http://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
  function sortNumber(a, b) {
      return a - b;
  }

  /* Accessor; returns element at index
   */
  SortedSet.prototype.at = function(index) {
    return setArray[index];
  };

  /* Converts a set into an Array and returns the result
   */
  SortedSet.prototype.toArray = function() {
    return setArray.slice(0);
  };

  /* Converts a set into a String and returns the result
   */
  SortedSet.prototype.toString = function() {
    return setArray.toString();
  };

  /* Synchronously iterates elements in the set
   */
  SortedSet.prototype.forEach = function(callback, thisArg) {
    if (this === void 0 || this === null ||
        setArray === void 0 || setArray === null) {
      throw new TypeError();
    }

    var t = Object(setArray);
    var len = t.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError();
    }

    var context = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t) callback.call(context, t[i], i, t);
    }
  };

  /* Read-only property for getting number of elements in sorted set
   */
  Object.defineProperty(SortedSet.prototype, 'length', {
    get: function() {
      return setArray.length;
    }
  });

  /* Returns true if a given element exists in the set
   */
  SortedSet.prototype.contains = function(element) {
    return setArray.indexOf(element) != -1;
  };

  /* Gets elements between startIndex and endIndex. If endIndex is omitted, a
   * single element at startIndex is returned.
   */
  SortedSet.prototype.get = function(startIndex, endIndex) {
    if (typeof endIndex == 'undefined') {
      return setArray[startIndex];
    } else {
      // add one to make endIndex inclusive, but don't add one if would go past end of array
      if (setArray.length == endIndex) {
	return setArray.slice(startIndex);
      } else {
	return setArray.slice(startIndex, endIndex + 1);
      }
    }
  };

  /* Gets all items between specified value range. If exclusive is set, values
   * at lower bound and upper bound are not included.
   */
  SortedSet.prototype.getBetween = function(lbound, ubound, exclusive) {
    // adjust lbound and ubound depending on what exclusive is (this is so can have just one if check to detemine if-between)
    // then, one-by-one, check if each element is between lbound and ubound
    // returning new array
    var result = [];
    if (exclusive) {
      // todo: check if lbound and ubound are already equal or one apart before doing this?
      // todo: or doesn't matter b/c even if that happens, if check to determine if-between would never succeed
      lbound++;
      ubound--;
    }
    for (var i = 0; i < setArray.length; i++) {
      if (setArray[i] >= lbound && setArray[i] <= ubound) {
	result.push(setArray[i]);
      }
    }
    return result;
  };

  /* Adds new element to the set if not already in set
   */
  SortedSet.prototype.add = function(element) {
    if (setArray.indexOf(element) == -1) {
      setArray.push(element);
      setArray.sort(sortNumber);
    }
  };

  /* Removes element from set and returns the element
   */
  SortedSet.prototype.remove = function(element) {
    // just use indexOf, and if element present, slice & concat
    var elementIndex = setArray.indexOf(element);
    if (elementIndex != -1) {
      return this.removeAt(elementIndex);
    }
  };

  /* Removes element at index location and returns the element
   */
  SortedSet.prototype.removeAt = function(index) {
    // todo: check if index outside bounds?
    var removed = setArray.splice(index, 1);  // removes 1 element from index 'index'
    // splice returned an array, but we're guaranteed to have 1 integer
    return removed[0];
  };

  /* Removes elements that are larger than lower bound and smaller than upper
   * bound and returns removed elements.
   */
  SortedSet.prototype.removeBetween = function(lbound, ubound, exclusive) {
    var bottom = this.getBetween(Number.MIN_SAFE_INTEGER, lbound, !exclusive);  // todo: may increment one from MIN_SAFE_INTEGER if exclusive is true
    var middle = this.getBetween(lbound, ubound, exclusive);
    var top = this.getBetween(ubound, Number.MAX_SAFE_INTEGER, !exclusive);  // todo: similar concern as above
    setArray = bottom.concat(top);
    return middle;
  };

  /* Removes all elements from the set
   */
  SortedSet.prototype.clear = function() {
    setArray = [];
  };

  /* BONUS MARKS AWARDED IF IMPLEMENTED
   * Implement an asynchronous forEach function. (See above for synchrnous
   * implementation). This method ASYNCHRONOUSLY iterates through each elements
   * in the array and calls a callback function.
   */
  SortedSet.prototype.forEachAsync = function(callback, thisArg) {
    // TODO: Implement for bonus marks
  };

  return SortedSet;
}));
