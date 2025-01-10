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

    var data = {"OkPercent": 54.11764705882353, "KoPercent": 45.88235294117647};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3512867647058823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.443125, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.46125, 500, 1500, "Condition"], "isController": false}, {"data": [0.275, 500, 1500, "All"], "isController": false}, {"data": [0.286875, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.284375, 500, 1500, "Featured"], "isController": false}, {"data": [0.39625, 500, 1500, "City"], "isController": false}, {"data": [0.745625, 500, 1500, "Json"], "isController": false}, {"data": [0.27625, 500, 1500, "Random1"], "isController": false}, {"data": [0.28125, 500, 1500, "randomCount"], "isController": false}, {"data": [0.28375, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.318125, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.27875, 500, 1500, "Random"], "isController": false}, {"data": [0.400625, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.333125, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.28, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.120625, 500, 1500, "Home"], "isController": false}, {"data": [0.506875, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13600, 6240, 45.88235294117647, 863.450882352939, 156, 21615, 328.0, 980.0, 1441.7499999999945, 11834.949999999999, 532.4146570623238, 3434.8718372587496, 49.30753675031318], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 800, 390, 48.75, 358.48374999999993, 166, 690, 311.0, 550.6999999999999, 622.7999999999997, 673.98, 36.218761318362915, 97.43275654484334, 2.864076364994567], "isController": false}, {"data": ["Condition", 800, 390, 48.75, 339.725, 157, 1095, 305.0, 503.9, 525.9499999999999, 843.98, 37.43215422047539, 81.48548626707841, 2.772684470335018], "isController": false}, {"data": ["All", 800, 390, 48.75, 671.940000000001, 176, 1664, 333.0, 1144.0, 1201.85, 1523.93, 43.43105320304017, 109.42939484934853, 4.021295636536373], "isController": false}, {"data": ["TopDiscounted1", 800, 390, 48.75, 495.30499999999967, 162, 1320, 312.5, 800.0, 830.9499999999999, 906.8600000000001, 46.630916297505244, 598.2636700534799, 4.0608515242480765], "isController": false}, {"data": ["Featured", 800, 390, 48.75, 596.9612499999989, 183, 1354, 318.5, 1108.6999999999998, 1151.85, 1278.8700000000001, 37.56750410894576, 284.03326044846204, 3.2151583411598965], "isController": false}, {"data": ["City", 800, 390, 48.75, 409.8537500000004, 157, 2056, 312.0, 661.8, 779.9499999999999, 964.0, 36.368595717597856, 79.29716800870574, 2.6028940025912624], "isController": false}, {"data": ["Json", 800, 0, 0.0, 652.8487500000003, 310, 1982, 485.0, 1056.3999999999996, 1396.6999999999996, 1594.95, 51.93456245131134, 47.93125213012854, 10.701360036354194], "isController": false}, {"data": ["Random1", 800, 390, 48.75, 563.5149999999996, 169, 2315, 314.0, 896.9, 956.8999999999999, 1581.8400000000001, 39.763407724041954, 403.99534876857695, 3.7016082434514637], "isController": false}, {"data": ["randomCount", 800, 390, 48.75, 482.33374999999967, 165, 1191, 323.0, 740.8, 808.0, 986.7400000000002, 41.241365089184455, 307.30098020736676, 3.7153475873801423], "isController": false}, {"data": ["TopDiscounted", 800, 390, 48.75, 468.01375, 164, 1311, 314.0, 723.9, 757.0, 873.94, 45.57885141294439, 584.9987158692742, 3.832362408842297], "isController": false}, {"data": ["MostViewed", 800, 390, 48.75, 456.01500000000004, 162, 907, 315.0, 727.9, 846.9499999999999, 889.97, 47.78972520908005, 555.2144587253584, 4.161766353046596], "isController": false}, {"data": ["Random", 800, 390, 48.75, 571.39, 170, 1774, 312.5, 962.9, 979.0, 1059.6700000000003, 38.15519626079077, 387.8314546370487, 3.437321147517528], "isController": false}, {"data": ["Top10Listed", 800, 390, 48.75, 366.8075000000005, 165, 734, 314.0, 558.0, 572.9499999999999, 682.94, 50.58488776478027, 163.52034263357572, 4.152011539677521], "isController": false}, {"data": ["MostViewed1", 800, 390, 48.75, 440.5587499999996, 163, 904, 318.0, 711.0, 830.7999999999997, 888.96, 49.0376363859262, 569.9044915410077, 4.41769722324384], "isController": false}, {"data": ["randomCount1", 800, 390, 48.75, 503.47999999999973, 167, 1085, 356.0, 771.8, 816.0, 854.98, 42.43131430996075, 315.97846652235603, 3.9499658560517665], "isController": false}, {"data": ["Home", 800, 390, 48.75, 7007.193749999998, 493, 21615, 5300.0, 12383.3, 12937.8, 21522.89, 35.88087549336204, 76.08436280610871, 2.927147105983136], "isController": false}, {"data": ["searchSuggestions", 800, 390, 48.75, 294.24, 156, 1879, 298.0, 371.0, 439.0, 504.8700000000001, 37.50937734433609, 80.45546237633627, 3.2665026608214554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, 0.0641025641025641, 0.029411764705882353], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6236, 99.93589743589743, 45.85294117647059], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13600, 6240, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6236, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["All", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 389, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 389, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 388, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 800, 390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 390, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
