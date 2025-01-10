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

    var data = {"OkPercent": 46.87581699346405, "KoPercent": 53.12418300653595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3037581699346405, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38333333333333336, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.3788888888888889, 500, 1500, "Condition"], "isController": false}, {"data": [0.21055555555555555, 500, 1500, "All"], "isController": false}, {"data": [0.245, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.2388888888888889, 500, 1500, "Featured"], "isController": false}, {"data": [0.3411111111111111, 500, 1500, "City"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "Json"], "isController": false}, {"data": [0.22833333333333333, 500, 1500, "Random1"], "isController": false}, {"data": [0.2311111111111111, 500, 1500, "randomCount"], "isController": false}, {"data": [0.23055555555555557, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.27944444444444444, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.22333333333333333, 500, 1500, "Random"], "isController": false}, {"data": [0.3672222222222222, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.3022222222222222, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.22777777777777777, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.12833333333333333, 500, 1500, "Home"], "isController": false}, {"data": [0.41444444444444445, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15300, 8128, 53.12418300653595, 816.890980392157, 157, 18257, 350.0, 942.8999999999996, 1553.7499999999945, 11045.929999999998, 621.9765031098825, 3686.771399180353, 50.08571867758852], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 900, 508, 56.44444444444444, 361.40222222222246, 181, 1327, 313.0, 515.9, 570.9499999999999, 1314.0, 48.190190618976224, 131.95944577934247, 3.238615067466267], "isController": false}, {"data": ["Condition", 900, 508, 56.44444444444444, 344.0622222222219, 158, 1138, 309.0, 535.9, 610.9499999999999, 936.7100000000003, 45.85052728106373, 106.13601049467624, 2.886354373630852], "isController": false}, {"data": ["All", 900, 508, 56.44444444444444, 656.4855555555553, 170, 1618, 343.0, 1186.1, 1379.7999999999997, 1584.99, 49.68532626697582, 129.3118301969471, 3.909700369879651], "isController": false}, {"data": ["TopDiscounted1", 900, 508, 56.44444444444444, 490.6799999999998, 163, 2341, 363.0, 765.9, 806.9499999999999, 1372.0, 53.60333531864205, 610.0562090530078, 3.9672051816557476], "isController": false}, {"data": ["Featured", 900, 508, 56.44444444444444, 533.6077777777779, 187, 1932, 330.0, 994.0, 1059.7499999999995, 1424.6600000000012, 44.594192845109504, 307.17826180197704, 3.2435307452185116], "isController": false}, {"data": ["City", 900, 508, 56.44444444444444, 399.21888888888867, 188, 2210, 316.0, 603.9, 710.0, 1323.5600000000004, 45.92305337279314, 107.1513495477855, 2.7932537758955], "isController": false}, {"data": ["Json", 900, 0, 0.0, 640.6411111111111, 309, 2065, 525.0, 1100.5, 1284.85, 1577.0, 58.47953216374269, 53.97008507959714, 12.049981725146198], "isController": false}, {"data": ["Random1", 900, 508, 56.44444444444444, 530.1233333333325, 165, 1624, 331.0, 890.9, 917.0, 970.98, 45.62968971810992, 414.6348515767593, 3.60997388967755], "isController": false}, {"data": ["randomCount", 900, 508, 56.44444444444444, 482.9633333333333, 167, 1160, 329.0, 751.9, 774.0, 960.4200000000005, 47.157453497511135, 320.3244735721771, 3.610492533403196], "isController": false}, {"data": ["TopDiscounted", 900, 508, 56.44444444444444, 506.19, 163, 2369, 366.0, 766.8, 836.8999999999999, 1370.0, 52.207204594234, 593.8140127400081, 3.730639828296305], "isController": false}, {"data": ["MostViewed", 900, 508, 56.44444444444444, 441.8577777777775, 164, 1665, 339.5, 703.8999999999997, 787.0, 961.2600000000007, 54.91153142159853, 568.027856162294, 4.064025320317266], "isController": false}, {"data": ["Random", 900, 508, 56.44444444444444, 524.4033333333335, 235, 1659, 333.0, 868.0, 898.9499999999999, 1088.96, 44.55224988861937, 405.06058641898915, 3.411031632097421], "isController": false}, {"data": ["Top10Listed", 900, 508, 56.44444444444444, 414.6633333333331, 166, 1337, 371.0, 651.6999999999999, 811.7499999999997, 1329.99, 58.81584106652725, 189.2755159660502, 4.102813357731016], "isController": false}, {"data": ["MostViewed1", 900, 508, 56.44444444444444, 441.7899999999997, 162, 1579, 359.0, 693.9, 802.9499999999999, 1293.5500000000004, 56.768008073672256, 586.8687885352277, 4.346300618140533], "isController": false}, {"data": ["randomCount1", 900, 508, 56.44444444444444, 496.0588888888884, 164, 1148, 326.0, 779.0, 798.8999999999999, 1041.6300000000003, 48.389698370880154, 328.5603287643153, 3.828330824237862], "isController": false}, {"data": ["Home", 900, 508, 56.44444444444444, 6303.230000000005, 477, 18257, 5298.0, 11744.9, 12266.199999999999, 17609.96, 48.28585224529213, 109.39490953109073, 3.3477352594023286], "isController": false}, {"data": ["searchSuggestions", 900, 508, 56.44444444444444, 319.76888888888885, 157, 988, 314.0, 396.0, 457.0, 933.94, 45.530429503718324, 104.03283210337938, 3.369726058582486], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 87, 1.0703740157480315, 0.5686274509803921], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8041, 98.92962598425197, 52.55555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15300, 8128, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8041, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 87, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 507, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 503, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["All", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 502, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 500, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 506, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 498, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 496, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 474, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 34, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 502, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 507, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 900, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 506, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
