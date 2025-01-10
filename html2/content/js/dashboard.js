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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6729411764705883, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.9825, 500, 1500, "Condition"], "isController": false}, {"data": [0.55, 500, 1500, "All"], "isController": false}, {"data": [0.55, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.5475, 500, 1500, "Featured"], "isController": false}, {"data": [0.9325, 500, 1500, "City"], "isController": false}, {"data": [0.63, 500, 1500, "Json"], "isController": false}, {"data": [0.55, 500, 1500, "Random1"], "isController": false}, {"data": [0.545, 500, 1500, "randomCount"], "isController": false}, {"data": [0.55, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.57, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.5475, 500, 1500, "Random"], "isController": false}, {"data": [0.8675, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.605, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.55, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.4825, 500, 1500, "Home"], "isController": false}, {"data": [0.98, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 0, 0.0, 668.0982352941169, 155, 10472, 662.0, 960.0, 1023.0, 1250.9899999999998, 224.05271828665568, 2182.496396210873, 37.9041392092257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 200, 0, 0.0, 301.0499999999999, 165, 433, 312.5, 379.0, 388.95, 398.0, 18.47916474175367, 41.56007460962764, 2.8512773722627736], "isController": false}, {"data": ["Condition", 200, 0, 0.0, 372.74500000000006, 160, 891, 402.0, 483.0, 489.0, 519.98, 19.093078758949883, 24.257905727923628, 2.759546539379475], "isController": false}, {"data": ["All", 200, 0, 0.0, 956.2450000000002, 173, 1388, 1005.0, 1163.9, 1216.0, 1380.89, 27.262813522355508, 53.00806808887677, 4.925410646128681], "isController": false}, {"data": ["TopDiscounted1", 200, 0, 0.0, 696.7150000000004, 170, 920, 722.5, 884.0, 894.0, 913.9100000000001, 32.53619651862697, 718.2111192451603, 5.528611517813568], "isController": false}, {"data": ["Featured", 200, 0, 0.0, 848.6049999999999, 170, 1457, 905.5, 1081.9, 1106.95, 1190.4200000000005, 19.72192091509713, 232.076163593334, 3.2934067153140716], "isController": false}, {"data": ["City", 200, 0, 0.0, 402.1100000000001, 155, 734, 431.0, 507.9, 510.95, 524.99, 18.49283402681461, 23.946775312066574, 2.5824953767914933], "isController": false}, {"data": ["Json", 200, 0, 0.0, 687.2350000000002, 310, 1881, 642.0, 1062.8, 1212.4499999999998, 1836.710000000003, 37.98670465337132, 35.0579445631529, 7.827338556505223], "isController": false}, {"data": ["Random1", 200, 0, 0.0, 806.3050000000001, 167, 976, 864.0, 932.8, 956.8499999999999, 973.99, 22.269235051775972, 375.0459955391939, 4.044997773076495], "isController": false}, {"data": ["randomCount", 200, 0, 0.0, 648.2700000000001, 165, 1609, 684.5, 719.0, 739.8499999999999, 1567.8100000000065, 24.084778420038536, 278.5893846339114, 4.233652456647398], "isController": false}, {"data": ["TopDiscounted", 200, 0, 0.0, 620.7349999999998, 168, 913, 637.5, 791.4000000000001, 835.0999999999998, 905.97, 30.670142616163165, 677.019437202883, 5.03182027296427], "isController": false}, {"data": ["MostViewed", 200, 0, 0.0, 658.4150000000001, 168, 913, 683.5, 886.0, 894.0, 908.95, 34.77656059815684, 685.6144583550687, 5.909298382889932], "isController": false}, {"data": ["Random", 200, 0, 0.0, 828.5500000000003, 168, 1007, 888.5, 968.9, 986.0, 1006.97, 20.646226902033654, 347.38073174744505, 3.6292195726231036], "isController": false}, {"data": ["Top10Listed", 200, 0, 0.0, 405.535, 165, 1077, 444.0, 608.9, 687.8499999999999, 770.94, 40.983606557377044, 137.11898053278688, 6.563780737704918], "isController": false}, {"data": ["MostViewed1", 200, 0, 0.0, 618.2899999999997, 166, 906, 663.5, 885.9, 895.95, 904.97, 37.18854592785422, 733.1663722573447, 6.537049088880624], "isController": false}, {"data": ["randomCount1", 200, 0, 0.0, 650.9799999999998, 166, 870, 697.5, 732.9, 741.0, 840.1700000000008, 25.647601949217748, 296.8229033085407, 4.65864644780713], "isController": false}, {"data": ["Home", 200, 0, 0.0, 1578.9399999999996, 465, 10472, 653.5, 5244.600000000028, 10443.2, 10470.99, 17.5284837861525, 21.054721735319895, 2.790178571428571], "isController": false}, {"data": ["searchSuggestions", 200, 0, 0.0, 276.94500000000005, 157, 756, 219.5, 365.9, 461.0, 691.3800000000015, 19.690853598503494, 23.940539775524268, 3.345906763808211], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
