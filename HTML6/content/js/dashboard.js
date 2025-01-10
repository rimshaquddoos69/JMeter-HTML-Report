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

    var data = {"OkPercent": 67.84313725490196, "KoPercent": 32.15686274509804};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4290686274509804, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.645, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.5516666666666666, 500, 1500, "Condition"], "isController": false}, {"data": [0.33, 500, 1500, "All"], "isController": false}, {"data": [0.3383333333333333, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.3458333333333333, 500, 1500, "Featured"], "isController": false}, {"data": [0.5258333333333334, 500, 1500, "City"], "isController": false}, {"data": [0.6675, 500, 1500, "Json"], "isController": false}, {"data": [0.3383333333333333, 500, 1500, "Random1"], "isController": false}, {"data": [0.345, 500, 1500, "randomCount"], "isController": false}, {"data": [0.3375, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.4083333333333333, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.345, 500, 1500, "Random"], "isController": false}, {"data": [0.4925, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.4141666666666667, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.3375, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.21833333333333332, 500, 1500, "Home"], "isController": false}, {"data": [0.6533333333333333, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10200, 3280, 32.15686274509804, 950.0068627450987, 153, 19318, 497.0, 1032.8999999999996, 1275.0, 12838.99, 376.8008865903214, 2801.5383294468047, 43.52611574159586], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 600, 205, 34.166666666666664, 338.78999999999996, 166, 558, 303.0, 459.0, 475.94999999999993, 521.94, 29.778152761923668, 75.75568848019752, 3.024828310337982], "isController": false}, {"data": ["Condition", 600, 205, 34.166666666666664, 371.88666666666717, 157, 1085, 308.0, 566.9, 633.9499999999999, 961.5000000000005, 28.154474215194032, 53.68839192494487, 2.678890889681385], "isController": false}, {"data": ["All", 600, 205, 34.166666666666664, 829.5666666666663, 172, 1558, 1024.5, 1236.6999999999998, 1301.0, 1521.91, 32.15261775896254, 75.34696986696854, 3.82414150835968], "isController": false}, {"data": ["TopDiscounted1", 600, 205, 34.166666666666664, 599.1649999999997, 167, 894, 692.0, 856.0, 868.0, 886.99, 34.76849973923625, 542.4772148620849, 3.8893863721967894], "isController": false}, {"data": ["Featured", 600, 205, 34.166666666666664, 702.1566666666665, 176, 1474, 761.0, 1061.9, 1138.0, 1239.5800000000004, 27.308725137681492, 240.8515770788767, 3.0022263011469663], "isController": false}, {"data": ["City", 600, 205, 34.166666666666664, 409.2699999999998, 155, 988, 321.0, 689.9, 715.8999999999999, 866.7400000000002, 28.636884306987398, 55.064291296773575, 2.632738297656548], "isController": false}, {"data": ["Json", 600, 0, 0.0, 746.6400000000002, 307, 2201, 745.5, 1212.9, 1376.9499999999998, 1773.1200000000008, 36.63898387884709, 33.81592154677577, 7.549634373473375], "isController": false}, {"data": ["Random1", 600, 205, 34.166666666666664, 728.0599999999985, 169, 1100, 951.5, 1055.0, 1068.0, 1084.0, 28.882256666987583, 350.9300425110715, 3.4537425086646767], "isController": false}, {"data": ["randomCount", 600, 205, 34.166666666666664, 616.385, 167, 1242, 778.0, 866.9, 892.9499999999999, 980.0, 30.04055474891103, 260.8494612257798, 3.4763727907675364], "isController": false}, {"data": ["TopDiscounted", 600, 205, 34.166666666666664, 558.2199999999998, 166, 880, 615.0, 817.9, 846.9499999999999, 865.99, 34.015533760417256, 530.4922906981689, 3.6739433924825673], "isController": false}, {"data": ["MostViewed", 600, 205, 34.166666666666664, 537.2299999999998, 164, 938, 502.0, 868.8, 882.0, 915.94, 36.023054755043226, 506.0357965035123, 4.0297274630763695], "isController": false}, {"data": ["Random", 600, 205, 34.166666666666664, 701.348333333333, 207, 1159, 851.5, 1004.9, 1049.6999999999996, 1148.99, 27.865502507895226, 338.61220726709087, 3.224669967954672], "isController": false}, {"data": ["Top10Listed", 600, 205, 34.166666666666664, 415.5716666666668, 164, 1090, 391.5, 622.9, 653.0, 671.96, 38.83495145631068, 126.96943264563107, 4.094609627831716], "isController": false}, {"data": ["MostViewed1", 600, 205, 34.166666666666664, 525.0849999999998, 165, 936, 463.0, 834.0, 890.0, 928.99, 37.35059760956175, 524.6251322833665, 4.322310367903387], "isController": false}, {"data": ["randomCount1", 600, 205, 34.166666666666664, 636.123333333333, 164, 1226, 782.5, 889.9, 910.8999999999999, 945.9200000000001, 31.14941335271519, 270.3439536068425, 3.7248492822656005], "isController": false}, {"data": ["Home", 600, 205, 34.166666666666664, 7108.09833333333, 466, 19318, 5307.5, 12886.8, 12925.0, 18752.23, 29.864118261908317, 55.11324839169279, 3.1295593331591256], "isController": false}, {"data": ["searchSuggestions", 600, 205, 34.166666666666664, 326.5200000000001, 153, 641, 300.0, 425.0, 447.94999999999993, 530.6600000000003, 28.085942985535738, 52.39573459369002, 3.141840594719843], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, 0.12195121951219512, 0.0392156862745098], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3276, 99.8780487804878, 32.11764705882353], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10200, 3280, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3276, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 204, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["All", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 204, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 204, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 204, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 600, 205, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 205, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
