/**
 * A Better `setInterval`
 * 
 * @static
 * @memberof module:utils/util
 * @param {Function} fn The function to be executed every delay milliseconds
 * @param {number} period The timer should delay in between executions of the specified function
 * @returns {Function} Returns a cancel function
 */
function timer(fn, period) {
  var start = new Date().getTime(),  
      time = 0;

  function loop() {
    fn();
    time += period;      
    var diff = (new Date().getTime() - start) - time;
    var callTime = diff < 0 ? 0 : Math.max(0, (period - diff));
    setTimeout(loop, callTime);  
  }

  setTimeout(loop, period);
}

module.exports = timer;