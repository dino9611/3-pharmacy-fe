/*eslint no-extend-native: ["error", { "exceptions": ["Function"] }]*/

Function.debounce = (head, tail, delay) => {
  let timeoutID;
  return function returnFunc() {
    // ! head function
    if (!timeoutID) {
      head === null || head.call(this, ...arguments);
    }
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      // ! tail function
      tail === null || tail.call(this, ...arguments);
      timeoutID = false;
    }, delay);
  };
};

Function.prototype.debouncify = function (delay, immediate) {
  const func = this;
  let timeoutID;
  return immediate
    ? // ! immediate debounce
      function returnFunc() {
        if (!timeoutID) {
          func.call(this, ...arguments);
        }
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
          timeoutID = false;
        }, delay);
      }
    : // ! normal debounce
      function returnFunc() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(func.bind(this, ...arguments), delay);
      };
};

// Function.doubleClick = (double, single, delay) => {
//   let timeoutID;
//   return function returnFunc() {
//     if (!timeoutID) {
//       head === null || head.call(this, ...arguments);
//     }
//     clearTimeout(timeoutID);
//     timeoutID = setTimeout(() => {
//       tail === null || tail.call(this, ...arguments);
//       timeoutID = false;
//     }, delay);
//   };
// };

// Function.prototype.throttleize = function (limit) {
//   const func = this;
//   let timeoutID;
//   return function () {
//     const context = this;
//     if (!timeoutID) {
//       func.call(context, ...arguments);

//       timeoutID = setTimeout(() => {
//         timeoutID = false;
//       }, limit);
//     }
//   };
// };
