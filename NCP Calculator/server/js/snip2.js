var csv = require('./ya-csv');

var string = require('./string');

var watch = require('./watch');

var snip = exports;

var reader = csv.createCsvFileReader('./../data/snip2.csv', {
    columnsFromHeader : true
});

var dataArray = [];

var state = {
    loading : false
};

function init(callback) {
    "use strict";

    reader.addListener('data', function(data) {
        "use strict";

        Object.keys(data).forEach(function(element, key, _array) {
            "use strict";
            // element is the name of the key.
            // key is just a numerical value for the array
            // _array is the array of all the keys

            var name = string.trim(element);
			
            //Replace '\n' with '_'
            name = name.replace(/\n|[ ]\n/g, "_");
            //Replace ' ' and '-' with '_'
            name = name.replace(/ |-/g, "_");
            //Remove ''' and '(' and ')' and ','
            name = name.replace(/'|\(|\)|,/g, "");

            //Rename object.key 
            data[name] = data[element];
            delete data[element];

            var value = data[name];

            //Trim object.value
            if (!value) {
                value = '';
            } else {
                value = string.trim(value);
            }

            data[name] = value;

        }, "");

        dataArray.push(data);
    });

    reader.addListener('end', function() {
        "use strict";
        callback();
    });
}

snip.getRecord = function getRecord(issn, callback) {
    "use strict";
    if (state.loading) {
        //Wait for loading to finish
        watch.watch(state,"loading", function(){
            watch.unwatch(state,"loading", null);
            processDataArray();		
        });
		
    } else if (dataArray.length === 0) {
        state.loading = true;
        init(function callback() {
            "use strict";
            processDataArray();
            state.loading = false;		
        });
    } else {
        processDataArray();
    //console.log(dataArray);
    }

    function processDataArray() {
        "use strict";
        if (dataArray) {
            var found = false;
			
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i].Print_ISSN === issn) {
                    callback(dataArray[i]);
                    found = true;
                    break;
                }
            }
            // If no record found fire empty callback
            if (!found) {
                callback(null);
            }
        }
    }
}

snip.getSnip = function getSnip(data,year) {
    if (!data) {
        return null;
    }
    return data[year + "_SNIP2"];
}

snip.getTitle = function getTitle(data) {
    if (!data) {
        return null;
    }
    return data["Source_Title"];
}

snip.getISSN = function getISSN(data) {
    if (!data) {
        return null;
    }
    return data["Print_ISSN"];
}

snip.getEISSN = function getEISSN(data) {
    if (!data) {
        return null;
    }
    return data["E_ISSN"];
}
