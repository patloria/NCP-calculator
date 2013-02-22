var varSearchObj;
var authorId;
var scopusDocumentIdentifiers = [];
var scopusJournalIdentifiers = [];
var scopusJournalPapers = [];
var scopusJournals = [];
var journalsRDCP = [];
var counter = 0;
var resultSetReturned = 0;
var grossTotal = 0;
var evalYear;
var docTypeValid = false;
var docsearch = false;
var currentYear;
var journalCount = 0;
var authorCPP = 0;
var authorName = "";

var snipCount = 0;

var author = {
    allDataGathered: false
};

if (!window.console) {
    console = {};
}

console.log = console.log || function() {
    };
console.warn = console.warn || function() {
    };
console.error = console.error || function() {
    };
console.info = console.info || function() {
    };
    
watch(author,"allDataGathered", function(){
    unwatch(author,"allDataGathered", null);

    console.log(JSON.stringify(scopusJournalIdentifiers));
    console.log(JSON.stringify(journalsRDCP));
    
    if (author.allDataGathered === true){ 
        var totalRDCP = 0;
       
        for (var x = 0; x < scopusJournalIdentifiers.length; x++) {
            
            var index = -1;
            
            for (var y = 0; y < journalsRDCP.length; y++) {
                if($.inArray(scopusJournalIdentifiers[x],journalsRDCP[y]) != -1){
                    index = y;
                }
            }           
            
            totalRDCP = totalRDCP + journalsRDCP[index][1];
        }
    
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        if (minutes < 10){
            minutes = "0" + minutes
        }

        console.log(hours + ":" + minutes + " Average RDCP = " + totalRDCP/scopusJournalIdentifiers.length);
        console.log(hours + ":" + minutes + " Author CPP = " + authorCPP);
    
        console.log(hours + ":" + minutes + " Author NCP = " + authorCPP / (totalRDCP/scopusJournalIdentifiers.length));
        
        $("#ncpTable").last().append("<tr><td>" + authorId + "</td><td>" + authorName + "</td><td>" + authorCPP + "</td><td>" + authorCPP / (totalRDCP/scopusJournalIdentifiers.length) + "</td><td>" + evalYear + "</td></tr>");
        
        document.sciverseForm.searchButton.disabled = false;   
    }
});  

callback = function() {

    if (docsearch) {
        try {
            grossTotal = sciverse._results.totalResults * 1;
            resultSetReturned = sciverse._results.results.length * 1;
        } catch (error) {
            grossTotal = 0;
            resultSetReturned = 0;
        }

        counter = counter + resultSetReturned * 1;

        for ( var i = 0; i < resultSetReturned; i++) {
            if (sciverse._results.results[i].doctype === "Journal" | (sciverse._results.results[i].doctype === "Conference Proceeding") | (sciverse._results.results[i].doctype === "Review")) {
                scopusJournalPapers[scopusJournalPapers.length] = sciverse._results.results[i].scp;
            } else {
		//console.log(sciverse._results.results[i].scp + " : " + sciverse._results.results[i].doctype);  
	    }
        }

        if (grossTotal != counter) {
	  
            varSearchObj.setSearch('ISSN('
                + scopusJournalIdentifiers.unique()[journalCount]
                + ') AND PUBYEAR IS ' + currentYear );//+ ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');

            varSearchObj.setOffset(counter * 1);

            sciverse.search(varSearchObj);
        } else {
            if (currentYear + 3 != evalYear) {
                counter = 0;
                grossTotal = 0;
                currentYear--;

                varSearchObj.setOffset(0);
		
                varSearchObj.setSearch('ISSN('
                    + scopusJournalIdentifiers.unique()[journalCount]
                    + ') AND PUBYEAR IS ' + currentYear );//+ ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');

                sciverse.search(varSearchObj);
            } else {

                var currentTime = new Date()
                var hours = currentTime.getHours()
                var minutes = currentTime.getMinutes()
                if (minutes < 10){
                    minutes = "0" + minutes
                }
                    
                console.log(hours + ":" + minutes + " Done Retrieving Journal Papers");

                Object.prototype.clone = function() {
                    var newObj = (this instanceof Array) ? [] : {};
                    for (i in this) {
                        if (i == 'clone')
                            continue;
                        if (this[i] && typeof this[i] === "object") {
                            newObj[i] = this[i].clone();
                        } else
                            newObj[i] = this[i]
                    }
                    return newObj;
                };

                var journal = [];
                journal.push(scopusJournalIdentifiers.unique()[journalCount],
                    scopusJournalPapers.unique().clone());
                scopusJournals.push(journal);

                journalCount++;

                if (journalCount < scopusJournalIdentifiers.unique().length ) {
                    counter = 0;
                    grossTotal = 0;
                    currentYear = evalYear - 1;
                    scopusJournalPapers = [];

                    varSearchObj.setOffset(0);
                    
                    var currentTime = new Date()
                    var hours = currentTime.getHours()
                    var minutes = currentTime.getMinutes()
                    if (minutes < 10){
                        minutes = "0" + minutes
                    }
                    
                    console.log(hours + ":" + minutes + " Retrieving Journal Papers For Journal " + scopusJournalIdentifiers.unique()[journalCount] );
		    
                    varSearchObj.setSearch('ISSN('
                        + scopusJournalIdentifiers.unique()[journalCount]
                        + ') AND PUBYEAR IS ' + currentYear );//+ ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');		    

                    sciverse.search(varSearchObj);
                } else {
                    calculateRdcp(scopusJournals, 0);
                }
            }
        }
    } else {
        
        try {
            grossTotal = sciverse._results.totalResults * 1;
            resultSetReturned = sciverse._results.results.length * 1;
        } catch (error) {
            grossTotal = 0;
            resultSetReturned = 0;
        }

        counter = counter + resultSetReturned * 1;

        for ( var i = 0; i < resultSetReturned; i++) {
            if (sciverse._results.results[i].doctype === "Journal" | (sciverse._results.results[i].doctype === "Conference Proceeding") | (sciverse._results.results[i].doctype === "Review")) {
                docTypeValid = true;
            }

            if (docTypeValid === true) {
                    
                if ( sciverse._results.results[i].issn && sciverse._results.results[i].scp) {
                    
                    //Find Snip for Journal               
                    
                    snipCount++;

                    $.ajax({
                        dataType : 'jsonp',
                        jsonp : 'callback',
                        url : 'http://127.0.0.1:3000/snip2/' + sciverse._results.results[i].issn 
                        + "?year=" + evalYear
                        + "&scp=" + sciverse._results.results[i].scp
                        + "&currentYear=" + currentYear,
                        success : function(data) {
                            if (data){
                                if ( !(data['snip'] === "" || data['snip'] === "0.000" || data['snip'] === null || data['snip'] === 'undefined') ) {

                                    if ( parseInt(data['issn'])) {                
                                        scopusJournalIdentifiers[scopusJournalIdentifiers.length] = data['issn'];
                                        scopusDocumentIdentifiers[scopusDocumentIdentifiers.length] = data['scp'];   
                                    } else {
  
                                    }
                                }                            
                            }
                            snipCount--;
                                                       
                            if ( snipCount === 0 && parseInt(data['currentYear']) === parseInt(data['year'] - 3)) {
                                //console.log("All Done");
                                Array.prototype.unique = function(a) {
                                    return function() {
                                        return this.filter(a);
                                    }
                                }(function(a, b, c) {
                                    return c.indexOf(a, b + 1) < 0;
                                });
                
                                var currentTime = new Date()
                                var hours = currentTime.getHours()
                                var minutes = currentTime.getMinutes()
                                if (minutes < 10){
                                    minutes = "0" + minutes
                                }
                                   
                                console.log(hours + ":" + minutes + " Done Retrieving Authors Papers");
                
                                console.log(hours + ":" + minutes + " Authors Papers Count " + scopusDocumentIdentifiers.length);

                                console.log(hours + ":" + minutes + " Journals For Author " + scopusJournalIdentifiers.unique().length);
                
                                console.log(hours + ":" + minutes + " Retrieving Author CPP ");

                                if ( scopusDocumentIdentifiers.length === 0 ) {
                                    author.allDataGathered = true;   
                                } else {

                                    var papersString = JSON.stringify(scopusDocumentIdentifiers);

                                    papersString = papersString.replace(/ +?/g, '');
                                    papersString = papersString.replace(/"+?/g, '');
                                    papersString = papersString.replace(/\[+?/g, '');
                                    papersString = papersString.replace(/\]+?/g, '');
              
                                    $.ajax({
                                        dataType : 'jsonp',
                                        jsonp : 'callback',
                                        timeout: 3000000,
                                        url : 'http://127.0.0.1:3000/citations?scp=' + papersString
                                        + '&year=' + evalYear + '&count='
                                        + scopusDocumentIdentifiers.length,

                                        success : function(data) {
                        
                                            console.log(hours + ":" + minutes + " Done Retrieving Author CPP " + data["cit"] / data["count"]);
                        
                                            authorCPP = data["cit"] / data["count"];
                        
                                            console.log(hours + ":" + minutes + " Retrieving Journal Papers For Journal " + scopusJournalIdentifiers.unique()[journalCount] );

                                            docsearch = true;

                                            counter = 0;
                                            grossTotal = 0;
                                            currentYear = evalYear - 1;
					    
                                            varSearchObj.setSearch('ISSN('
                                                + scopusJournalIdentifiers.unique()[journalCount]
                                                + ') AND PUBYEAR IS ' + currentYear );//+ ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');
					    
                                            sciverse.search(varSearchObj);
                        
                                        },
                                        error : function(xhr, ajaxOptions, thrownError) {
                                            console.log(xhr.statusText);
                                            console.log(thrownError);
                                        }
                                    });
                                }
                            }                            
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            count--;
                            console.log(xhr.statusText);
                            console.log(thrownError);
                        }
                    });
 
                } else {

                }

                docTypeValid = false;
            }
        }

        if (grossTotal != counter) {

            varSearchObj.setSearch('AU-ID(' + authorId + ') AND PUBYEAR IS '
                + currentYear + ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');
            varSearchObj.setOffset(counter * 1);

            sciverse.search(varSearchObj);
        } else {
            if (currentYear + 3 != evalYear) {

                counter = 0;
                grossTotal = 0;
                currentYear--;

                varSearchObj.setOffset(0);

                varSearchObj.setSearch('AU-ID(' + authorId
                    + ') AND PUBYEAR IS ' + currentYear + ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');

                sciverse.search(varSearchObj);
            } else {

            }
        }
    }
};

function calculateRdcp(scopusJournals, count) {
    var papersString = JSON.stringify(scopusJournals[count][1]);

    papersString = papersString.replace(/ +?/g, '');
    papersString = papersString.replace(/"+?/g, '');
    papersString = papersString.replace(/\[+?/g, '');
    papersString = papersString.replace(/\]+?/g, '');

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
        minutes = "0" + minutes
    }
                    
    console.log(hours + ":" + minutes + " Retrieving RDCP for " + scopusJournals[count][0]);
    
    $.ajax({
        dataType : 'jsonp',
        jsonp : 'callback',
        timeout: 3000000,
        url : 'http://127.0.0.1:3000/citations?scp=' + papersString
        + '&year=' + evalYear + '&issn='
        + scopusJournals[count][0] + '&count='
        + scopusJournals[count][1].length,

        success : function(data) {

            var currentTime = new Date()
            var hours = currentTime.getHours()
            var minutes = currentTime.getMinutes()
            if (minutes < 10){
                minutes = "0" + minutes
            }
                    
            console.log(hours + ":" + minutes + " RDCP for " + data["issn"] + " = " + (data["cit"] / data["count"])/data["snip"]);
            console.log(hours + ":" + minutes + " " + JSON.stringify(data));
            
            var journalRDCP = [];
            journalRDCP.push(data["issn"], (data["cit"] / data["count"]) / data["snip"]);
            journalsRDCP.push(journalRDCP);
 

            count++;
            if (count < scopusJournals.length) {
                calculateRdcp(scopusJournals, count);
            } else {
                //All CPP's Gathered
                console.log("All Data Gathered");
                author.allDataGathered = true;
            }
        },
        error : function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.statusText);
            console.log(thrownError);
        }
    });
}

runSearch = function() {
    
    //Reseting defaults for new search
    scopusDocumentIdentifiers = [];
    scopusJournalIdentifiers = [];
    scopusJournalPapers = [];
    scopusJournals = [];
    journalsRDCP = [];
    counter = 0;
    resultSetReturned = 0;
    grossTotal = 0;
    docTypeValid = false;
    docsearch = false;
    journalCount = 0;
    authorCPP = 0;
    authorName = "";
    author.allDataGathered = false;  
    
    document.sciverseForm.searchButton.disabled = true;
    varSearchObj = new searchObj();
    authorId = document.sciverseForm.searchString.value;
    evalYear = document.sciverseForm.evalYear.value * 1;

    counter = 0;
    grossTotal = 0;
    currentYear = evalYear - 1;   

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
        minutes = "0" + minutes
    }
                    
    console.log(hours + ":" + minutes + " Retrieving Authors papers");
    
    $.ajax({
        dataType : 'jsonp',
        jsonp : 'callback',
        url : 'http://127.0.0.1:3000/author?id=' + authorId,

        success : function(data) {
            
            if (data["error"]) {
                console.log(data["error"]);
                document.sciverseForm.searchButton.disabled = false;    
            } else {
            
                authorName = data["name"];
            
                varSearchObj.setSearch("AU-ID(" + authorId + ") AND PUBYEAR IS "
                    + currentYear + ' AND ( LIMIT-TO(DOCTYPE, "ar" ) OR LIMIT-TO(DOCTYPE, "cp" ) OR LIMIT-TO(DOCTYPE, "re" ) )');

                sciverse.search(varSearchObj);
            }

        },
        error : function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.statusText);
            console.log(thrownError);
            
            console.log("Server Error");
            document.sciverseForm.searchButton.disabled = false;    
        }
    });
        
    
};

sciverse.setApiKey("Enter Your API KEY here");
sciverse.setCallback(callback);
