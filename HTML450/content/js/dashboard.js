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

    var data = {"OkPercent": 89.33333333333333, "KoPercent": 10.666666666666666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5781699346405229, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7766666666666666, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.8311111111111111, 500, 1500, "Condition"], "isController": false}, {"data": [0.4677777777777778, 500, 1500, "All"], "isController": false}, {"data": [0.5055555555555555, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.46, 500, 1500, "Featured"], "isController": false}, {"data": [0.6622222222222223, 500, 1500, "City"], "isController": false}, {"data": [0.7877777777777778, 500, 1500, "Json"], "isController": false}, {"data": [0.45444444444444443, 500, 1500, "Random1"], "isController": false}, {"data": [0.47333333333333333, 500, 1500, "randomCount"], "isController": false}, {"data": [0.4811111111111111, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.59, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.45111111111111113, 500, 1500, "Random"], "isController": false}, {"data": [0.7044444444444444, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.6055555555555555, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.4766666666666667, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.21777777777777776, 500, 1500, "Home"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7650, 816, 10.666666666666666, 1038.850196078432, 153, 20742, 630.0, 1031.0, 1200.0, 13099.49, 284.95865305818376, 2558.0585067375027, 43.135790713700366], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 450, 51, 11.333333333333334, 394.91777777777776, 167, 7719, 348.0, 577.8000000000001, 634.9, 679.49, 20.965337308982484, 49.191060103545475, 2.8682656133525906], "isController": false}, {"data": ["Condition", 450, 51, 11.333333333333334, 348.22444444444443, 159, 865, 316.0, 507.90000000000003, 541.45, 748.96, 20.45547524887495, 30.29470089549525, 2.6213904609300425], "isController": false}, {"data": ["All", 450, 51, 11.333333333333334, 976.3822222222225, 174, 1270, 1107.0, 1216.8000000000002, 1236.45, 1260.96, 23.426518819303453, 48.691266951689315, 3.7526659866468846], "isController": false}, {"data": ["TopDiscounted1", 450, 51, 11.333333333333334, 672.1911111111112, 170, 7315, 661.5, 939.0, 953.45, 987.98, 25.004167361226873, 498.3151488789798, 3.7672294340723456], "isController": false}, {"data": ["Featured", 450, 51, 11.333333333333334, 919.1111111111106, 187, 7808, 915.5, 1107.7, 1179.9, 7407.080000000001, 20.739238639505945, 223.80572950271915, 3.0707845337127844], "isController": false}, {"data": ["City", 450, 51, 11.333333333333334, 496.54666666666645, 154, 7427, 464.5, 705.3000000000002, 759.3499999999999, 806.49, 20.597793747425275, 30.90357443241635, 2.5504520786606855], "isController": false}, {"data": ["Json", 450, 0, 0.0, 582.9777777777779, 309, 1540, 429.0, 953.4000000000002, 1082.85, 1453.98, 27.81555198417604, 25.67047070095191, 5.731524871739399], "isController": false}, {"data": ["Random1", 450, 51, 11.333333333333334, 816.8488888888893, 169, 7281, 909.0, 999.0, 1006.0, 1039.8600000000001, 21.310854328471304, 326.2189549689809, 3.432212984229968], "isController": false}, {"data": ["randomCount", 450, 51, 11.333333333333334, 688.8666666666662, 168, 929, 771.5, 822.9000000000001, 842.45, 898.49, 21.974802226779957, 232.94186901797048, 3.4249789408145324], "isController": false}, {"data": ["TopDiscounted", 450, 51, 11.333333333333334, 714.4244444444446, 172, 7597, 618.5, 820.9000000000001, 853.0, 7440.5, 24.499128919860627, 488.16088101589725, 3.5638576600609757], "isController": false}, {"data": ["MostViewed", 450, 51, 11.333333333333334, 660.02, 163, 7348, 549.5, 943.8000000000001, 970.0, 979.49, 25.40650406504065, 453.00673404683266, 3.827847116361789], "isController": false}, {"data": ["Random", 450, 51, 11.333333333333334, 877.4777777777778, 169, 7609, 928.0, 1005.0, 1014.45, 4426.240000000054, 20.84491384102279, 318.83037596118214, 3.2488752431906613], "isController": false}, {"data": ["Top10Listed", 450, 51, 11.333333333333334, 451.44888888888846, 167, 5338, 441.0, 578.0, 594.9, 704.1500000000012, 27.056277056277057, 89.73952931472462, 3.84213226010101], "isController": false}, {"data": ["MostViewed1", 450, 51, 11.333333333333334, 659.7244444444448, 166, 7334, 560.0, 883.3000000000002, 904.0, 7313.35, 25.890340026465683, 461.7538210725792, 4.035252215062425], "isController": false}, {"data": ["randomCount1", 450, 51, 11.333333333333334, 731.1577777777782, 167, 929, 827.0, 884.9000000000001, 898.45, 915.49, 22.681451612903228, 240.36697879914314, 3.6529541015625], "isController": false}, {"data": ["Home", 450, 51, 11.333333333333334, 7378.102222222216, 475, 20742, 10298.0, 13133.0, 13422.249999999995, 19718.88, 20.915640250987686, 29.59331607308854, 2.9520193033929814], "isController": false}, {"data": ["searchSuggestions", 450, 51, 11.333333333333334, 292.0311111111109, 153, 546, 293.0, 377.0, 385.0, 473.43000000000006, 20.885547201336674, 29.96736089355333, 3.146701388888889], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, 0.8578431372549019, 0.0915032679738562], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 809, 99.1421568627451, 10.57516339869281], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7650, 816, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 809, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["All", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 46, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 450, 51, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 51, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
