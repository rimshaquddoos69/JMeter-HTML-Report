/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.8529411764706, "KoPercent": 0.14705882352941177};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6497794117647059, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95125, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.81625, 500, 1500, "Condition"], "isController": false}, {"data": [0.53, 500, 1500, "All"], "isController": false}, {"data": [0.57375, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.505, 500, 1500, "Featured"], "isController": false}, {"data": [0.76125, 500, 1500, "City"], "isController": false}, {"data": [0.9325, 500, 1500, "Json"], "isController": false}, {"data": [0.5225, 500, 1500, "Random1"], "isController": false}, {"data": [0.5225, 500, 1500, "randomCount"], "isController": false}, {"data": [0.56875, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.5825, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.52375, 500, 1500, "Random"], "isController": false}, {"data": [0.81, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.62875, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.525, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.31, 500, 1500, "Home"], "isController": false}, {"data": [0.9825, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6800, 10, 0.14705882352941177, 994.0013235294118, 153, 20240, 656.5, 1075.0, 1262.6499999999987, 11400.97, 265.61462442873324, 2588.494124680188, 44.873201364204526], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 400, 0, 0.0, 586.1775000000001, 168, 10397, 334.5, 484.0, 539.75, 10283.99, 18.6584569456106, 41.9633069782629, 2.87894159902976], "isController": false}, {"data": ["Condition", 400, 0, 0.0, 457.5599999999996, 265, 925, 451.5, 605.9000000000001, 724.8499999999999, 915.98, 18.43402921793631, 23.420578137241346, 2.6642932854048573], "isController": false}, {"data": ["All", 400, 0, 0.0, 1079.5075, 171, 1614, 1118.5, 1388.9, 1461.95, 1525.9, 21.522733387140168, 41.84742399784773, 3.8883844498251277], "isController": false}, {"data": ["TopDiscounted1", 400, 0, 0.0, 683.0750000000008, 166, 1678, 742.5, 826.9000000000001, 877.8, 906.96, 23.080030004039006, 509.4736310657204, 3.9218019733425655], "isController": false}, {"data": ["Featured", 400, 0, 0.0, 984.5874999999993, 171, 4437, 927.0, 1139.0, 1293.8999999999987, 4414.99, 18.827073331450627, 221.76426224348114, 3.1439741598418527], "isController": false}, {"data": ["City", 400, 0, 0.0, 493.0724999999999, 251, 947, 490.5, 669.0, 719.9, 863.9200000000001, 18.349465571815223, 23.761124363502912, 2.5624741960640396], "isController": false}, {"data": ["Json", 400, 0, 0.0, 434.26000000000005, 311, 1301, 385.5, 636.0000000000003, 896.95, 1092.3600000000006, 25.497195308516062, 23.530251027855684, 5.253816611422743], "isController": false}, {"data": ["Random1", 400, 0, 0.0, 844.6424999999997, 176, 1545, 841.0, 1008.1000000000004, 1174.95, 1284.8700000000001, 19.895548371051976, 335.0985451380254, 3.613839840835613], "isController": false}, {"data": ["randomCount", 400, 0, 0.0, 710.2200000000001, 165, 1891, 702.5, 893.8000000000001, 1040.8, 1389.93, 20.602626834921455, 238.2909577807108, 3.6215554983260367], "isController": false}, {"data": ["TopDiscounted", 400, 0, 0.0, 653.0550000000004, 166, 933, 689.5, 788.9000000000001, 806.0, 832.97, 22.47191011235955, 496.0498595505618, 3.686797752808989], "isController": false}, {"data": ["MostViewed", 400, 0, 0.0, 633.7300000000002, 165, 1049, 672.0, 877.0, 892.95, 914.99, 23.64765001477978, 466.2097250960686, 4.018253029855158], "isController": false}, {"data": ["Random", 400, 0, 0.0, 840.7899999999994, 173, 1293, 871.0, 984.9000000000001, 1029.85, 1101.91, 19.25576469455543, 324.4259281128147, 3.384802387714822], "isController": false}, {"data": ["Top10Listed", 400, 0, 0.0, 423.40500000000003, 169, 758, 436.0, 608.0, 644.8, 733.94, 25.05166906745162, 83.81544748543871, 4.012181374084048], "isController": false}, {"data": ["MostViewed1", 400, 0, 0.0, 588.6899999999996, 165, 1201, 629.0, 861.7, 893.95, 915.98, 24.285107158035334, 478.77709307267315, 4.268866492623399], "isController": false}, {"data": ["randomCount1", 400, 0, 0.0, 727.4350000000005, 164, 1226, 740.0, 848.0, 915.95, 1075.8000000000002, 21.091484313208543, 243.9080316537042, 3.831070392828895], "isController": false}, {"data": ["Home", 400, 10, 2.5, 6387.792499999998, 455, 20240, 10305.5, 11709.400000000001, 13540.45, 19893.9, 18.708198868153968, 23.35373330877882, 2.9035161182825875], "isController": false}, {"data": ["searchSuggestions", 400, 0, 0.0, 370.0224999999997, 153, 3586, 336.5, 419.90000000000003, 456.95, 3436.9, 18.812905653278147, 22.873112830401656, 3.196724202803123], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, 100.0, 0.14705882352941177], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6800, 10, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home", 400, 10, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
