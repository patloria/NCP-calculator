//Software: USQ NCP Calculator
//Author: Tim McCallum
//Date: 2012

//Number Validation Section Start

var snip = require('./snip');
//var graph = require('./graph');

snip.getRecord("16194500", function(data) {
	if (!data) {
		console.log("Record not found");
	} else {
		// console.log(data);
		console.log(snip.getTitle(data));
		console.log(snip.getISSN(data));
		console.log(snip.getSnip(data, "2008"));
		console.log(snip.getSnip(data, "2009"));
		
		//graph.plot(graph.createObject('NCP Calculator', 'Source usq.edu.au', 'Years',
		//		'NCP', '[]', '[]'));
		
	}
	console.log("");
});

snip.getRecord("15597768", function(data) {
	if (!data) {
		console.log("Record not found");
	} else {
		// console.log(data);
		console.log(snip.getTitle(data));
		console.log(snip.getISSN(data));
		console.log(snip.getSnip(data, "2008"));
		console.log(snip.getSnip(data, "2009"));
	}
	console.log("");
});

snip.getRecord("255858", function(data) {
	if (!data) {
		console.log("Record not found");
	} else {
		// console.log(data);
		console.log(snip.getTitle(data));
		console.log(snip.getISSN(data));
		console.log(snip.getSnip(data, "2008"));
		console.log(snip.getSnip(data, "2009"));
	}
	console.log("");
});

snip.getRecord("3899160", function(data) {
	if (!data) {
		console.log("Record not found");
	} else {
		// console.log(data);
		console.log(snip.getTitle(data));
		console.log(snip.getISSN(data));
		console.log(snip.getSnip(data, "2008"));
		console.log(snip.getSnip(data, "2009"));
	}
	console.log("");
});

snip.getRecord("1", function(data) {
	// console.log(data);
	if (!data) {
		console.log("Record not found");
	}
	console.log("");
});

function isNumber(n) {
	"use strict";
	return (!isNaN(parseFloat(n)) && isFinite(n));

}
function checkForNumberError() {
	"use strict";
	var err = 0, i, j;
	if (arguments.length > 0) {
		for (i = 0, j = arguments.length; i < j; i += 1) {
			if (!isNumber(arguments[i])) {
				err = err += 1;
			}
		}
		return err;
	}
}

// Calculate NCP Start
function calculateNcp(ac, rdcp) {
	"use strict";
	var ncp;
	// Ensure that ac and rdcp are both valid numbers
	if (checkForNumberError(ac, rdcp) === 0) {
		// divide the author citations by the relative database citation
		// potential
		ncp = ac / rdcp;
		// return the ncp
		return ncp;
	}
}
// Calculate NCP End
