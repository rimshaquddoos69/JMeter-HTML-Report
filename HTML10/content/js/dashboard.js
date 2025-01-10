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

    var data = {"OkPercent": 48.8, "KoPercent": 51.2};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3039705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4065, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.392, 500, 1500, "Condition"], "isController": false}, {"data": [0.251, 500, 1500, "All"], "isController": false}, {"data": [0.269, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.2605, 500, 1500, "Featured"], "isController": false}, {"data": [0.348, 500, 1500, "City"], "isController": false}, {"data": [0.4495, 500, 1500, "Json"], "isController": false}, {"data": [0.2615, 500, 1500, "Random1"], "isController": false}, {"data": [0.262, 500, 1500, "randomCount"], "isController": false}, {"data": [0.2655, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.2925, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.2645, 500, 1500, "Random"], "isController": false}, {"data": [0.358, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.2935, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.263, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.0855, 500, 1500, "Home"], "isController": false}, {"data": [0.445, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17000, 8704, 51.2, 949.546941176465, 156, 24548, 353.0, 1160.0, 2355.5999999999913, 13453.930000000011, 579.6310818643663, 3516.8639081625693, 48.53691099253299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 1000, 544, 54.4, 352.45399999999995, 170, 1314, 319.0, 500.9, 527.9499999999999, 896.3300000000006, 41.032374543514834, 111.8439548413073, 2.887012227647614], "isController": false}, {"data": ["Condition", 1000, 544, 54.4, 372.835, 160, 1230, 324.0, 521.3999999999999, 611.8999999999999, 925.99, 41.76934965122593, 95.17905019109477, 2.7528612004511093], "isController": false}, {"data": ["All", 1000, 544, 54.4, 660.9420000000005, 178, 1869, 347.0, 1242.0, 1413.7499999999995, 1654.7700000000002, 46.19791185438418, 119.21592218250484, 3.805913910191259], "isController": false}, {"data": ["TopDiscounted1", 1000, 544, 54.4, 485.039, 173, 2292, 341.0, 810.0, 834.0, 923.99, 49.065305922182425, 577.0349260647172, 3.801794563564104], "isController": false}, {"data": ["Featured", 1000, 544, 54.4, 586.6800000000002, 177, 1644, 371.0, 1028.9, 1097.9499999999998, 1347.91, 41.53168867846166, 293.5727440505856, 3.162573199601296], "isController": false}, {"data": ["City", 1000, 544, 54.4, 401.05199999999974, 159, 1330, 326.0, 630.9, 710.7999999999997, 1011.95, 41.02732419791581, 93.7234364102117, 2.6126071838844673], "isController": false}, {"data": ["Json", 1000, 0, 0.0, 1222.168999999999, 306, 5493, 1197.0, 2158.0, 2291.95, 2877.9300000000003, 54.01026194977045, 49.854108999459896, 11.129067647853091], "isController": false}, {"data": ["Random1", 1000, 544, 54.4, 568.1309999999994, 175, 1360, 347.0, 993.9, 1016.0, 1322.96, 43.19654427645788, 405.36253037257023, 3.577888768898488], "isController": false}, {"data": ["randomCount", 1000, 544, 54.4, 492.3440000000001, 178, 1873, 334.0, 808.6999999999999, 863.0, 988.4800000000005, 44.381324338718265, 309.48137648677437, 3.5574405290253863], "isController": false}, {"data": ["TopDiscounted", 1000, 544, 54.4, 483.5630000000001, 177, 1665, 352.0, 759.8, 806.0, 970.7800000000002, 48.0007680122882, 564.6199089185427, 3.591057456919311], "isController": false}, {"data": ["MostViewed", 1000, 544, 54.4, 446.5739999999994, 169, 1341, 342.0, 727.0, 879.8499999999998, 922.98, 50.45917852457362, 539.4168476101271, 3.909797910990009], "isController": false}, {"data": ["Random", 1000, 544, 54.4, 572.6830000000004, 185, 1366, 372.0, 936.9, 1013.0, 1333.0, 42.122999157540015, 394.6429746735468, 3.376421651221567], "isController": false}, {"data": ["Top10Listed", 1000, 544, 54.4, 410.1549999999996, 168, 1670, 357.0, 585.9, 651.0, 1359.0, 53.1632110579479, 170.82201538410422, 3.882575757575758], "isController": false}, {"data": ["MostViewed1", 1000, 544, 54.4, 460.2070000000003, 169, 2469, 351.0, 731.9, 888.8499999999998, 1403.8000000000002, 51.72770535899027, 552.9700795636768, 4.146298882681564], "isController": false}, {"data": ["randomCount1", 1000, 544, 54.4, 522.6179999999991, 167, 1340, 336.0, 870.0, 887.9499999999999, 1121.92, 45.51039912620033, 317.07979501831795, 3.7695410276248125], "isController": false}, {"data": ["Home", 1000, 544, 54.4, 7771.926000000007, 507, 24548, 5328.0, 13822.6, 23122.9, 23963.55, 39.950461427829495, 88.97030182573609, 2.8998416962965923], "isController": false}, {"data": ["searchSuggestions", 1000, 544, 54.4, 332.92600000000033, 156, 1314, 330.0, 419.0, 483.0, 571.96, 41.80602006688963, 93.97932071749581, 3.239313336120401], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 177, 2.033547794117647, 1.0411764705882354], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8527, 97.96645220588235, 50.15882352941176], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17000, 8704, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8527, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 177, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 532, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 530, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["All", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 532, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 535, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 519, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 25, "", "", "", "", "", ""], "isController": false}, {"data": ["City", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 532, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 544, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 539, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 534, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 532, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 532, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 522, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 522, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 542, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 544, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 1000, 544, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 536, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
