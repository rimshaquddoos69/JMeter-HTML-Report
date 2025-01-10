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

    var data = {"OkPercent": 58.99159663865546, "KoPercent": 41.00840336134454};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.373781512605042, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49357142857142855, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.5457142857142857, 500, 1500, "Condition"], "isController": false}, {"data": [0.29428571428571426, 500, 1500, "All"], "isController": false}, {"data": [0.2935714285714286, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.29428571428571426, 500, 1500, "Featured"], "isController": false}, {"data": [0.41928571428571426, 500, 1500, "City"], "isController": false}, {"data": [0.7135714285714285, 500, 1500, "Json"], "isController": false}, {"data": [0.29428571428571426, 500, 1500, "Random1"], "isController": false}, {"data": [0.2935714285714286, 500, 1500, "randomCount"], "isController": false}, {"data": [0.2935714285714286, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.33214285714285713, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.29285714285714287, 500, 1500, "Random"], "isController": false}, {"data": [0.4542857142857143, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.3464285714285714, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.2935714285714286, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.135, 500, 1500, "Home"], "isController": false}, {"data": [0.5642857142857143, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11900, 4880, 41.00840336134454, 890.6597478991571, 152, 20901, 393.5, 970.0, 1340.0, 12154.99, 397.01074264362444, 2699.021964869554, 39.99657776322813], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 700, 305, 43.57142857142857, 361.2442857142857, 166, 716, 309.0, 557.9, 647.9499999999999, 704.99, 32.98153034300792, 86.61065818766491, 2.8716201293347154], "isController": false}, {"data": ["Condition", 700, 305, 43.57142857142857, 326.57000000000016, 157, 680, 303.0, 477.0, 485.89999999999986, 643.7400000000002, 29.413000546241438, 61.174281219799155, 2.398833722005126], "isController": false}, {"data": ["All", 700, 305, 43.57142857142857, 750.6971428571429, 170, 1471, 1029.0, 1231.0, 1251.9499999999998, 1411.8100000000002, 32.69347531642614, 80.13988136938956, 3.3329739240343748], "isController": false}, {"data": ["TopDiscounted1", 700, 305, 43.57142857142857, 559.3471428571428, 167, 7297, 620.5, 845.0, 872.0, 895.99, 33.37624564916798, 460.88041395484674, 3.2002641789443573], "isController": false}, {"data": ["Featured", 700, 305, 43.57142857142857, 628.6328571428566, 170, 1921, 672.0, 1046.8, 1096.9499999999998, 1136.99, 29.1351036377258, 233.07501671366435, 2.745438860505286], "isController": false}, {"data": ["City", 700, 305, 43.57142857142857, 416.8057142857141, 156, 3998, 309.0, 671.0, 748.0, 806.0, 28.601781482389477, 59.92376476056223, 2.253866667177413], "isController": false}, {"data": ["Json", 700, 0, 0.0, 676.7428571428578, 311, 2302, 571.0, 1158.4999999999995, 1402.9499999999998, 1662.97, 35.56910569105691, 32.82827982088415, 7.329180957825203], "isController": false}, {"data": ["Random1", 700, 305, 43.57142857142857, 614.1228571428571, 165, 978, 751.0, 943.0, 954.0, 967.99, 30.22713533120304, 328.38054748898867, 3.098197032343035], "isController": false}, {"data": ["randomCount", 700, 305, 43.57142857142857, 514.4671428571427, 163, 1752, 617.5, 731.0, 758.0, 819.99, 31.09867164245413, 245.122393750833, 3.084703618552579], "isController": false}, {"data": ["TopDiscounted", 700, 305, 43.57142857142857, 520.55, 167, 1557, 580.0, 785.9, 817.9499999999999, 857.95, 34.02683258798367, 470.1686075126386, 3.1501403606844254], "isController": false}, {"data": ["MostViewed", 700, 305, 43.57142857142857, 491.74428571428564, 166, 6923, 483.5, 775.0, 812.0, 892.96, 34.06989194977125, 425.1501870041614, 3.266774098364645], "isController": false}, {"data": ["Random", 700, 305, 43.57142857142857, 617.2228571428581, 166, 1837, 624.5, 969.9, 990.0, 1018.96, 29.33165723863398, 318.70011817777083, 2.9094319610307986], "isController": false}, {"data": ["Top10Listed", 700, 305, 43.57142857142857, 412.8271428571427, 165, 6587, 312.0, 623.0, 671.7499999999997, 700.98, 35.58537949265416, 115.31549457322963, 3.2159889558232932], "isController": false}, {"data": ["MostViewed1", 700, 305, 43.57142857142857, 515.3000000000003, 165, 6962, 463.0, 793.9, 817.9499999999999, 896.0, 34.83453595421747, 435.1165460158, 3.4552671684498635], "isController": false}, {"data": ["randomCount1", 700, 305, 43.57142857142857, 559.4171428571425, 164, 1639, 709.5, 817.9, 828.9499999999999, 872.0, 31.919744642042865, 251.49966690891472, 3.271684764021888], "isController": false}, {"data": ["Home", 700, 305, 43.57142857142857, 6891.352857142859, 525, 20901, 5305.0, 12234.0, 12434.5, 20620.32, 32.86847912851575, 66.48690800053998, 2.9523396047565384], "isController": false}, {"data": ["searchSuggestions", 700, 305, 43.57142857142857, 284.17142857142886, 152, 486, 297.0, 352.0, 384.0, 426.0, 29.413000546241438, 60.22274931457204, 2.820250456951973], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, 0.12295081967213115, 0.05042016806722689], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4874, 99.87704918032787, 40.95798319327731], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11900, 4880, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4874, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["All", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 304, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 304, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 304, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 303, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 304, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 700, 305, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 305, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
