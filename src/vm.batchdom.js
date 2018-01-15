var core_vm=require('./vm.0webcore.js');
var debug = 1 ? console.log.bind(console, '[batchdom]') : function() {};

var win=window;
var raf = function(cb) {
	  return setTimeout(cb, 16);
};
var reads=[];
var writes=[];
var scheduled=false;
function runTasks(tasks) {
  var task; while (task = tasks.shift()) task();
}
function flush() {
  var error;
  try {
    runTasks(reads);
    runTasks(writes);
  } catch (e) { error = e; }
  scheduled = false;
  if (reads.length || writes.length) scheduleFlush();
  if (error) {
    debug('task errored', error.message);
  }
}
var measure=function(fn, ctx) {
    var task = !ctx ? fn : fn.bind(ctx);
    reads.push(task);
    scheduleFlush();
    return task;
  }
var mutate =function(fn, ctx) {
    var task = !ctx ? fn : fn.bind(ctx);
    writes.push(task);
    scheduleFlush();
    return task;
  }
function scheduleFlush() {
  if (!scheduled) {
    scheduled = true;
    raf(flush);
  }
}
module.exports={
	get:measure,
	set:mutate,
}