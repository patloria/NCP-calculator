function createObject(title, subtitle, xtitle, ytitle, series, categories) {
 	return object = {
			title: title,
				subtitle: subtitle,
				xtitle: xtitle,
				ytitle: ytitle,	
				series: eval(series),
				categories: eval(categories)
		}
}

function plot(object) {
	var chart;
	/*
	 * var series = [{ name: 'Tokyogffhgfhfghddhfh', data: [0.0, 1.9, 0.5, 0.5,
	 * 0.2, 0.5, 0.2, 0.5, 0.3, 0.3, 0.9, 0.6] }, { name: 'New York', data:
	 * [0.0, 0.0, 0.7, 0.3, 0.0, 0.0, 0.8, 0.1, 0.1, 0.1, 0.6, 0.5] }, { name:
	 * 'Berlin', data: [0.9, 0.6, 0.5, 0.4, 0.5, 0.0, 0.6, 0.9, 0.3, 0.0, 0.9,
	 * 1.0] }, { name: 'London', data: [0.9, 0.2, 0.7, 0.5, 0.9, 0.2, 0.0, 0.6,
	 * 0.2, 0.3, 0.6, 0.8] }];
	 * 
	 * var categories = ['1999', '2000', '2001', '2002', '2003', '2004', '2005',
	 * '2006', '2007', '2008', '2009', '2010', '2011']
	 * 
	 * var title = 'NCP Calculator'; var subtitle = 'Source: usq.edu.au.com';
	 * var xtitle = 'Years'; var ytitle = 'NCP';
	 */
	var series = object.series;

	var categories = object.categories;

	var title = object.title;
	var subtitle = object.subtitle;
	var xtitle = object.xtitle;
	var ytitle = object.ytitle;

	$(document).ready(
			function() {
				chart = new Highcharts.Chart({
					chart : {
						renderTo : 'container',
						type : 'line',
						marginRight : 250,
						marginBottom : 50
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
					yAxis : {
						title : {
							text : ytitle
						},
						plotLines : [ {
							value : 0,
							width : 1,
							color : '#808080'
						} ]
					},
					tooltip : {
						formatter : function() {
							return '<b>' + this.series.name + '</b><br/>'
									+ this.x + ': ' + this.y;
						}
					},
					legend : {
						layout : 'vertical',
						align : 'right',
						verticalAlign : 'top',
						x : -10,
						y : 100,
						borderWidth : 0
					},
					series : series
				});
			});
}

