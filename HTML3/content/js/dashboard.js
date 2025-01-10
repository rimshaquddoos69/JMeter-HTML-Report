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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7145098039215686, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.995, 500, 1500, "Condition"], "isController": false}, {"data": [0.5183333333333333, 500, 1500, "All"], "isController": false}, {"data": [0.6766666666666666, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.615, 500, 1500, "Featured"], "isController": false}, {"data": [0.86, 500, 1500, "City"], "isController": false}, {"data": [0.7216666666666667, 500, 1500, "Json"], "isController": false}, {"data": [0.5683333333333334, 500, 1500, "Random1"], "isController": false}, {"data": [0.675, 500, 1500, "randomCount"], "isController": false}, {"data": [0.6733333333333333, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.68, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.56, 500, 1500, "Random"], "isController": false}, {"data": [0.8233333333333334, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.675, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.425, 500, 1500, "Home"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 0, 0.0, 798.0223529411767, 167, 11479, 541.0, 953.9000000000005, 1151.0, 11227.98, 265.12788521522145, 2582.3357531126535, 44.853034349656895], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 300, 0, 0.0, 276.19999999999976, 168, 471, 275.5, 354.0, 360.0, 371.98, 24.919013207076997, 56.04344474208821, 3.844925865935709], "isController": false}, {"data": ["Condition", 300, 0, 0.0, 312.7566666666667, 182, 774, 281.0, 444.0, 473.0, 689.0300000000018, 24.902465344069064, 31.638776770150244, 3.5991844442599814], "isController": false}, {"data": ["All", 300, 0, 0.0, 981.5733333333335, 478, 1715, 1144.0, 1271.7, 1333.95, 1386.9, 26.152907331531686, 50.85003759480429, 4.724890484700549], "isController": false}, {"data": ["TopDiscounted1", 300, 0, 0.0, 630.6633333333336, 198, 895, 740.0, 869.9000000000001, 877.0, 891.99, 28.741138149070704, 634.4381706265568, 4.883748083924123], "isController": false}, {"data": ["Featured", 300, 0, 0.0, 740.8499999999999, 269, 1214, 794.5, 1065.8000000000002, 1073.95, 1156.3500000000006, 24.723916268336904, 291.2154605602027, 4.128700861216417], "isController": false}, {"data": ["City", 300, 0, 0.0, 368.39333333333315, 168, 790, 367.5, 519.0, 524.0, 537.94, 24.644705495769323, 31.91296824940442, 3.4415946151318493], "isController": false}, {"data": ["Json", 300, 0, 0.0, 643.1366666666664, 314, 1588, 575.0, 980.7, 1136.75, 1458.99, 33.70786516853933, 31.1083435744382, 6.945663623595506], "isController": false}, {"data": ["Random1", 300, 0, 0.0, 780.2666666666668, 363, 1279, 918.5, 966.0, 979.0, 1033.7800000000002, 24.04616864379609, 405.0851854310275, 4.367761101314524], "isController": false}, {"data": ["randomCount", 300, 0, 0.0, 635.0633333333329, 341, 991, 734.5, 805.0, 812.9, 838.98, 25.0, 288.8311360677083, 4.39453125], "isController": false}, {"data": ["TopDiscounted", 300, 0, 0.0, 633.8866666666665, 363, 1340, 690.0, 803.5000000000002, 849.95, 890.94, 27.94076557697681, 616.7705713886561, 4.584031852472758], "isController": false}, {"data": ["MostViewed", 300, 0, 0.0, 606.4866666666674, 171, 891, 696.0, 867.9000000000001, 878.0, 886.99, 29.714738510301107, 585.8214268026941, 5.049184082805072], "isController": false}, {"data": ["Random", 300, 0, 0.0, 769.0366666666664, 284, 1192, 911.5, 947.0, 956.0, 977.96, 23.638799149003233, 397.9613382515168, 4.155257662910724], "isController": false}, {"data": ["Top10Listed", 300, 0, 0.0, 399.73999999999995, 167, 662, 346.5, 583.9000000000001, 630.0, 655.99, 33.59086328518643, 112.38505626469602, 5.3797866980181395], "isController": false}, {"data": ["MostViewed1", 300, 0, 0.0, 554.2866666666667, 167, 892, 640.0, 801.9000000000001, 831.75, 877.0, 31.227230144686168, 615.6399630477777, 5.489161548870616], "isController": false}, {"data": ["randomCount1", 300, 0, 0.0, 648.2133333333335, 361, 1213, 741.0, 819.0, 825.9, 837.98, 25.56672916311573, 295.13476462629967, 4.643956664394069], "isController": false}, {"data": ["Home", 300, 0, 0.0, 4319.870000000001, 457, 11479, 648.0, 11329.7, 11427.8, 11467.92, 24.32103769760843, 29.213746453182, 3.8714151803810295], "isController": false}, {"data": ["searchSuggestions", 300, 0, 0.0, 265.9566666666669, 172, 618, 233.0, 353.80000000000007, 413.95, 477.6500000000003, 25.29510961214165, 30.75430807335582, 4.298192453625632], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
