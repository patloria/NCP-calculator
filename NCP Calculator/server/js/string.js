var string = exports;

string.trim = function trim(string) {
	"use strict";
	var str = string.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}
