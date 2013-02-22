var express = require('express');

var server = express();

var Curl = require("node-curl");

var libxmljs = require("libxmljs");

server.get('/snip/:id', function(req, res) {
    var snip = require('./snip');

    snip.getRecord(req.params.id, function(data) {
        if (!data) {
            console.log("Record not found");
            console.log("requested SNIP ISSN " + req.params.id);
            res.send(req.query.callback + '({});');
        } else {
            // console.log(data);
            // console.log(snip.getTitle(data));
            // console.log(snip.getISSN(data));
            // console.log(snip.getSnip(data, "2008"));
            // console.log(snip.getSnip(data, "2009"));

            console.log("requested SNIP ISSN " + req.params.id);
            res.send(req.query.callback + "(" + JSON.stringify(data) + ");");
        }
    });
});

server.get('/snip2/:id', function(req, res) {
    var snip = require('./snip2');

    snip.getRecord(req.params.id, function(data) {
        if (!data) {
            console.log("Record not found");
            console.log("requested SNIP2 ISSN " + req.params.id);
            res.send(req.query.callback + '({});');
        } else {
            //console.log(data);
            
            if (req.query.year) {
                var snipYear = snip.getSnip(data,req.query.year);
                var data;
                
                if (req.query.scp) {
                    data = {
                        snip: snipYear,
                        scp: req.query.scp,
                        year: req.query.year,
                        currentYear: req.query.currentYear,
                        issn: req.params.id
                    };  
                } else {
                    data = {
                        snip: snipYear,
                        year: req.query.year,
                        currentYear: req.query.currentYear,
                        issn: req.params.id
                    };
                }
                res.send(req.query.callback + "(" + JSON.stringify(data) + ");");
            } else {
                // console.log(snip.getTitle(data));
                // console.log(snip.getISSN(data));
                // console.log(snip.getSnip(data, "2008"));
                // console.log(snip.getSnip(data, "2009"));

                console.log("requested SNIP2 ISSN " + req.params.id);
                //console.log(req.query.test);
            
                res.send(req.query.callback + "(" + JSON.stringify(data) + ");");
            }
        }
    });
});

server.get('/cpp/:issn', function(req, res) {
    var data = {};
    res.send(req.query.callback + "(" + JSON.stringify(data) + ");");
});

server.get('/citations', function(req, res) {
		
    var scpString = req.query.scp.split(",");  
    
    var total = 0;  
    var count = 0;

    getCitations(scpString, total, count, res, req);
                          
});

function getCitations(scpString, total, count, res, req) {
    var scplength = scpString.length;
                  
    var curl = Curl.create();     
    
    var scpSubString = "";
    
    var amount = 100;
    
    if ( scplength - count < amount) {
        amount = scplength - count ;
    } 
    
    //console.log("Amount =" + amount);
    
    for ( var k = count ; k < count + amount; k ++) {
        scpSubString = scpSubString + scpString[k];
        
        if ( k != count + amount -1 ) {
            scpSubString = scpSubString + ",";   
        }
    //console.log("scpSubString = " + scpSubString);
    }

    //console.log('http://api.elsevier.com/content/abstract/citations?scopus_id=' + scpSubString + '&date=' + req.query.year);

    curl('http://api.elsevier.com/content/abstract/citations?scopus_id=' + scpSubString + '&date=' + req.query.year, {
        HTTPHEADER: 'X-ELS-APIKey:8ae99ce7e5b3fa8bd33ed38d0360931c'
    }, function(err, resource) {
                
        if (err) {
            console.error(err);
            return; // quit early, since we can't get a json
        }
                
        //console.log(this.body);    
                
        var json = eval('(' + this.body + ')');
        /*
                var myData = JSON.parse(this.body, function (key, value) {
                    var type;
                    if (value && typeof value === 'object') {
                        type = value.type;
                        if (typeof type === 'string' && typeof window[type] === 'function') {
                            return new (window[type])(value);
                        }
                    }
                    return value;
                });*/
        //console.log(req);
            
        //console.log("Citations = " + json["abstract-citations-response"]["citeColumnTotalXML"]["citeCountHeader"]["rangeColumnTotal"]);
                
        var citations = json["abstract-citations-response"]["citeColumnTotalXML"]["citeCountHeader"]["rangeColumnTotal"];
            
        total = total + parseInt(citations);   
        // reset does not close the connection
        // but it does set everything up for reuse 
        resource.reset();
            
        count = count + amount;
            
        //console.log("count = " + count);
        //console.log("total = " + total);
            
        if ( count >= scplength - 1 ){
            if ( req.query.issn && req.query.count ) {
                var snip = require('./snip2');
                
                snip.getRecord(req.query.issn, function(record) {     
                    //console.log(record);
                    
                    data = {
                        cit: total,
                        snip: snip.getSnip(record,req.query.year),
                        issn: req.query.issn,
                        count: req.query.count
                    };
                    
                    res.send(req.query.callback + "(" + JSON.stringify(data)
                        + ");");                
                });
                
                //console.log(test);

                //console.log(data);
						
                //saveCPP(total,req.query.issn,req.query.count);
            } else {
                data = {
                    cit : total,
                    count: req.query.count
                };  
                
                res.send(req.query.callback + "(" + JSON.stringify(data)
                    + ");");   
            }       
        } else {
            getCitations(scpString, total, count, res, req);    
        }
    });	
    
}

server.get('/author', function(req, res) {
    
    var curl = Curl.create();  
   
    curl('http://api.elsevier.com/content/author/AUTHOR_ID:' + req.query.id + '?view=STANDARD', {
        HTTPHEADER: 'X-ELS-APIKey:8ae99ce7e5b3fa8bd33ed38d0360931c'
    }, function(err, resource) {
                
        if (err) {
            console.error(err);
            return; // quit early, since we can't get a json
        }
        
        var data;

        var xmlDoc = libxmljs.parseXmlString(this.body);

        if ( xmlDoc.find("//service-error")[0] ) {
            data = {
                id: req.query.id,
                error: xmlDoc.find('//statusText')[0].text()
            }
        } else {
                
            var authorName = xmlDoc.find('//indexed-name')[0].text();
        
            data = {
                name: authorName,
                id: req.query.id
            }
        }
            
        res.send(req.query.callback + "(" + JSON.stringify(data)
            + ");");  

        resource.reset();     
    });                       
});

/*server.get('/citations/scp,year,issn,count:',
		function(req, res) {
		});*/

function saveCPP(cit,issn,count) {
    var journalCPP = require('./journalCPP');
    journalCPP.writeData();
}

server.listen(3000);
console.log('Listening on port 3000...');
