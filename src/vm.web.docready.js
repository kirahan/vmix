
var readyList = [];
var readyFired = false;
var readyEventHandlersInstalled = false;
var ready=function () {
	if (!readyFired) {
		readyFired = true;
		for (var i = 0; i < readyList.length; i++) {
			readyList[i].fn.call(window, readyList[i].ctx);
		}
		readyList = [];
	}
}
var readyStateChange=function () {
	if ( document.readyState === "complete" ) {
		ready();
	}
}
module.exports.docReady = function(callback, context) {
	if (readyFired) {
		setTimeout(function() {callback(context);}, 1);
		return;
	} else {
		readyList.push({fn: callback, ctx: context});
	}
	if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
		setTimeout(ready, 1);
	} else if (!readyEventHandlersInstalled) {
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", ready, false);
			window.addEventListener("load", ready, false);
		} else {
			document.attachEvent("onreadystatechange", readyStateChange);
			window.attachEvent("onload", ready);
		}
		readyEventHandlersInstalled = true;
	}
}
//把web的 config文件 及其 配置系统 转到 mob