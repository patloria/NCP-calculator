function createObject(title, subtitle, xtitle, ytitle, series, categories) {
	return object = {
		title : title,
		subtitle : subtitle,
		xtitle : xtitle,
		ytitle : ytitle,
		series : eval(series),
		categories : eval(categories)
	}
}

function plot(object) {
	var chart;
	var series = object.series;

	var categories = object.categories;

	var title = object.title;
	var subtitle = object.subtitle;
	var xtitle = object.xtitle;
	var ytitle = object.ytitle;

	$(document).ready(function() {
		chart = new Highcharts.Chart({
			chart : {
				renderTo : 'container',
				type : 'spline',
			// marginRight : 250,
			// marginBottom : 50
			},
			title : {
				text : title,
				x : -20
			// center
			},
			subtitle : {
				text : subtitle,
				x : -20
			},
			xAxis : {
				title : {
					text : xtitle
				},
				categories : categories
			},
			yAxis : [ {
				min : 0,
				title : {
					text : ytitle
				},
				labels : {
					align : 'left',
					x : 3,
					y : 16,
					formatter : function() {
						return this.value;
					}
				}
			/*
			 * , plotLines : [ { value : 0, width : 1, color : '#808080' } ]
			 */
			}, {
				min : 0,
				linkedTo : 0,
				gridLineWidth : 0,
				opposite : true,
				title : {
					text : null
				},
				labels : {
					align : 'right',
					x : -3,
					y : 16,
					formatter : function() {
						return this.value;
					}
				}
			/*
			 * , plotLines : [ { value : 0, width : 1, color : '#808080' } ]
			 */
			} ],
			tooltip : {
				shared : true,
				crosshairs : true
			/*
			 * formatter : function() { return '<b>' + this.series.name + '</b><br/>' +
			 * this.x + ': ' + this.y; }
			 */
			},
			legend : {
				align : 'left',
				verticalAlign : 'bottom',
				y : 15,
				x : 0,
				floating : true,
				borderWidth : 0
			},
			/*
			 * legend : { layout : 'vertical', align : 'right', verticalAlign :
			 * 'top', x : -10, y : 100, borderWidth : 0 },
			 */
			/*
			 * navigation: { menuItemStyle: { fontSize: '10px' } },
			 */
			series : series
		});
	});
}

var count = 0;

var dataArray = [];

function colateGraphData(graphData) {

	dataArray.push(graphData);

	if (count === 0) {
		// console.log('Drawing ... ');

		// console.log(dataArray.length);

		var series = '[';

		for ( var i = 0; i < dataArray.length; i++) {
			// console.log(JSON.stringify(dataArray[i].series));

			series = series
					+ JSON.stringify(dataArray[i].series).substr(1,
							JSON.stringify(dataArray[i].series).length - 2);

			if (i < dataArray.length - 1) {
				series = series + ',';
			}

		}

		series = series + ']';

		// console.log(series);

		dataArray[0].series = eval(series);

		plot(dataArray[0]);

		dataArray = [];

	} else {
		// console.log('Waiting for all data');
	}
};

function runSearch2(searchString) {
	count++;

	// console.log(searchString);

	$.ajax({
		dataType : 'jsonp',
		// data : 'somedata=blahblah',
		jsonp : 'callback',
		url : 'http://127.0.0.1:3000/snip/' + searchString,
		success : function(data) {
			var series = "[{ name: '" + data['Source_Title']
					+ " (SNIP)', data: [";

			var categories;

			var years = 0;

			for ( var i = 1999; i < 3000; i++) {
				if (data[i + '_SNIP'] || data[i + '_SNIP'] === "") {
					years++;
				} else {
					break;
				}
			}

			for ( var i = 1999; i < 1999 + years; i++) {
				if (data[i + '_SNIP'] === "") {
					series = series + '0.0';
					if (i < 1999 + years - 1) {
						series = series + ',';
					}
				}
				if (data[i + '_SNIP']) {
					series = series + data[i + '_SNIP'];
					if (i < 1999 + years - 1) {
						series = series + ',';
					}
				}
			}

			series = series + "]}]";

			categories = "[";

			for ( var i = 1999; i < 1999 + years; i++) {
				categories = categories + "'" + i + "'";
				if (i < 1999 + years - 1) {
					categories = categories + ',';
				}
			}

			categories = categories + "]";

			var graphData = createObject('SNIP for ' + data['Source_Title'],
					'Source usq.edu.au', ' ', // 'Years',
					null, // 'SNIP',
					series, categories);

			// console.log(graphData);

			// plot(graphData);

			/*
			 * plot(createObject( 'NCP Calculator', 'Source usq.edu.au',
			 * 'Years', 'NCP', "[{ name: 'Ron Ward (NCP)', data:
			 * [0.123,0.235,0.32,0.65,0.43,0.53,0,0,0,0,0,0,0]}]",
			 * "['1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011']"));
			 */

			count--;
			colateGraphData(graphData);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			count--;
			console.log(xhr.statusText);
			console.log(thrownError);
		}
	});

	count++;

	$.ajax({
		dataType : 'jsonp',
		// data : 'somedata=blahblah',
		jsonp : 'callback',
		url : 'http://127.0.0.1:3000/snip2/' + searchString,
		success : function(data) {
			// console.log(data);

			var series = "[{ name: '" + data['Source_Title']
					+ " (SNIP2)', data: [";

			var categories;

			var years = 0;

			for ( var i = 1999; i < 3000; i++) {
				if (data[i + '_SNIP2'] || data[i + '_SNIP2'] === "") {
					years++;
				} else {
					break;
				}
			}

			for ( var i = 1999; i < 1999 + years; i++) {
				if (data[i + '_SNIP2'] === "") {
					series = series + '0.0';
					if (i < 1999 + years - 1) {
						series = series + ',';
					}
				}
				if (data[i + '_SNIP2']) {
					series = series + data[i + '_SNIP2'];
					if (i < 1999 + years - 1) {
						series = series + ',';
					}
				}
			}

			series = series + "]}]";

			categories = "[";

			for ( var i = 1999; i < 1999 + years; i++) {
				categories = categories + "'" + i + "'";
				if (i < 1999 + years - 1) {
					categories = categories + ',';
				}
			}

			categories = categories + "]";

			var graphData = createObject('SNIP for ' + data['Source_Title'],
					'Source usq.edu.au', ' ', // 'Years',
					null, // 'SNIP',
					series, categories);

			// console.log(graphData);

			// plot(graphData);

			/*
			 * plot(createObject( 'NCP Calculator', 'Source usq.edu.au',
			 * 'Years', 'NCP', "[{ name: 'Ron Ward (NCP)', data:
			 * [0.123,0.235,0.32,0.65,0.43,0.53,0,0,0,0,0,0,0]}]",
			 * "['1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011']"));
			 */
			count--;
			colateGraphData(graphData);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			count--;
			console.log(xhr.statusText);
			console.log(thrownError);
		}
	});

	// var schedule = [];
	// var data = [{ scp:0008063038, year:2010 }]
	// schedule.push(data);


};
