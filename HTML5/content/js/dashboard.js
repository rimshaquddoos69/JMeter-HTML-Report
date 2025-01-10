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

    var data = {"OkPercent": 79.29411764705883, "KoPercent": 20.705882352941178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5025882352941177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.676, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.686, 500, 1500, "Condition"], "isController": false}, {"data": [0.426, 500, 1500, "All"], "isController": false}, {"data": [0.452, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.426, 500, 1500, "Featured"], "isController": false}, {"data": [0.583, 500, 1500, "City"], "isController": false}, {"data": [0.715, 500, 1500, "Json"], "isController": false}, {"data": [0.427, 500, 1500, "Random1"], "isController": false}, {"data": [0.428, 500, 1500, "randomCount"], "isController": false}, {"data": [0.434, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.514, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.423, 500, 1500, "Random"], "isController": false}, {"data": [0.611, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.537, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.427, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.0, 500, 1500, "Home"], "isController": false}, {"data": [0.779, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8500, 1760, 20.705882352941178, 1066.8835294117619, 153, 22809, 551.0, 1001.0, 2500.0, 14228.949999999999, 286.23383620689657, 2361.963206324084, 38.53370403421336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 500, 110, 22.0, 378.3120000000001, 166, 794, 314.5, 653.5000000000002, 726.6999999999999, 784.9300000000001, 24.28953121204761, 59.155872373694436, 2.9232830337624485], "isController": false}, {"data": ["Condition", 500, 110, 22.0, 337.32400000000024, 157, 2172, 297.0, 529.0, 563.0, 788.7800000000002, 22.783195115282965, 38.24088102615511, 2.5684492618244783], "isController": false}, {"data": ["All", 500, 110, 22.0, 827.2839999999998, 171, 1458, 992.0, 1219.9, 1287.0, 1331.97, 25.44788273615635, 55.929128044202976, 3.5860639441673454], "isController": false}, {"data": ["TopDiscounted1", 500, 110, 22.0, 563.8739999999998, 163, 861, 615.0, 820.9000000000001, 829.0, 844.99, 26.511134676564158, 474.52544033337756, 3.513760935843054], "isController": false}, {"data": ["Featured", 500, 110, 22.0, 688.2239999999999, 173, 1558, 776.5, 993.0, 1019.95, 1048.95, 22.53571911479695, 222.3119640724298, 2.935365444855095], "isController": false}, {"data": ["City", 500, 110, 22.0, 426.25600000000014, 157, 2296, 395.0, 654.9000000000001, 718.95, 831.3600000000006, 22.17491573532021, 37.54958172565195, 2.4154200206226717], "isController": false}, {"data": ["Json", 500, 0, 0.0, 643.1680000000001, 315, 1947, 546.0, 1015.8000000000001, 1167.5, 1504.95, 25.771867429513943, 23.78456450376269, 5.310414089479924], "isController": false}, {"data": ["Random1", 500, 110, 22.0, 671.4560000000004, 165, 1093, 851.5, 900.9000000000001, 908.95, 962.99, 23.20616355704075, 320.54777967778244, 3.287842000835422], "isController": false}, {"data": ["randomCount", 500, 110, 22.0, 585.4279999999989, 163, 904, 701.0, 759.9000000000001, 785.95, 888.96, 24.08129846361316, 233.38700828998697, 3.3017717815344603], "isController": false}, {"data": ["TopDiscounted", 500, 110, 22.0, 539.1339999999998, 164, 1541, 575.0, 774.9000000000001, 817.9, 1039.4000000000005, 26.46202699126753, 473.86745625496167, 3.386312516538767], "isController": false}, {"data": ["MostViewed", 500, 110, 22.0, 508.66399999999953, 163, 2496, 534.5, 773.3000000000002, 813.95, 830.98, 26.487259628118874, 425.4686279102877, 3.5105965593049744], "isController": false}, {"data": ["Random", 500, 110, 22.0, 693.6960000000003, 170, 1319, 861.5, 965.0, 973.95, 991.0, 22.638775695010413, 312.9154126907317, 3.103988386308069], "isController": false}, {"data": ["Top10Listed", 500, 110, 22.0, 413.8219999999999, 166, 2006, 372.5, 609.0, 616.95, 627.99, 26.633995632024718, 87.64868219983487, 3.3271686730943375], "isController": false}, {"data": ["MostViewed1", 500, 110, 22.0, 478.7799999999996, 164, 2279, 492.0, 745.8000000000001, 759.0, 795.97, 26.45922633222205, 424.84783877731917, 3.6278079853945076], "isController": false}, {"data": ["randomCount1", 500, 110, 22.0, 615.0600000000003, 164, 969, 725.0, 805.1000000000004, 875.8499999999999, 964.96, 24.747574737675706, 240.02102383810137, 3.5062286552167885], "isController": false}, {"data": ["Home", 500, 110, 22.0, 9490.087999999996, 2214, 22809, 10355.5, 14599.600000000006, 21853.95, 22532.97, 21.920210434020166, 35.42383069377466, 2.7216167525208244], "isController": false}, {"data": ["searchSuggestions", 500, 110, 22.0, 276.4500000000003, 153, 615, 295.0, 380.90000000000003, 395.95, 432.94000000000005, 22.788387037965453, 37.1470737574632, 3.020351453899093], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, 0.5113636363636364, 0.10588235294117647], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1751, 99.48863636363636, 20.6], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8500, 1760, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1751, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NavCategories", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Condition", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["All", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted1", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Featured", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["City", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Random1", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["TopDiscounted", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 109, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Random", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 106, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["Top10Listed", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MostViewed1", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["randomCount1", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 109, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Home", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["searchSuggestions", 500, 110, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 107, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
