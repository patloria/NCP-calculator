var csv = require('./ya-csv');

var string = require('./string');

var watch = require('./watch');

var journalCPP = exports;

//var reader = csv.createCsvFileReader('./../data/journalCPP.csv', {
//	columnsFromHeader : true
//});

var writer = csv.createCsvFileWriter('./../data/journalCPP.csv');

var dataArray = [[['issn'],['year_1999'],['year_2000'],['year_2001']],
				[['00207160'],['2.734'],['2.464'],['1.453']],
				[['00307660'],['3.764'],['2.234'],['2.5653']]];

var state = {
	loading : false,
	writing : false
};

journalCPP.writeData = function writeData() {
	for ( var i = 0 ; i < dataArray.length ; i++ ) {
		writer.writeRecord(dataArray[i]);
	}
}
