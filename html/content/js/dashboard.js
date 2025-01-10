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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7962745098039216, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9983333333333333, 500, 1500, "NavCategories"], "isController": false}, {"data": [0.99, 500, 1500, "Condition"], "isController": false}, {"data": [0.515, 500, 1500, "All"], "isController": false}, {"data": [0.69, 500, 1500, "TopDiscounted1"], "isController": false}, {"data": [0.6616666666666666, 500, 1500, "Featured"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "City"], "isController": false}, {"data": [0.8883333333333333, 500, 1500, "Json"], "isController": false}, {"data": [0.5633333333333334, 500, 1500, "Random1"], "isController": false}, {"data": [0.6466666666666666, 500, 1500, "randomCount"], "isController": false}, {"data": [0.665, 500, 1500, "TopDiscounted"], "isController": false}, {"data": [0.9083333333333333, 500, 1500, "MostViewed"], "isController": false}, {"data": [0.565, 500, 1500, "Random"], "isController": false}, {"data": [0.99, 500, 1500, "Top10Listed"], "isController": false}, {"data": [0.9283333333333333, 500, 1500, "MostViewed1"], "isController": false}, {"data": [0.6516666666666666, 500, 1500, "randomCount1"], "isController": false}, {"data": [0.8766666666666667, 500, 1500, "Home"], "isController": false}, {"data": [1.0, 500, 1500, "searchSuggestions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 0, 0.0, 462.95941176470524, 156, 1568, 458.0, 717.0, 814.0, 1017.0, 0.07594627834272295, 0.7397166201764378, 0.01284821861898662], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NavCategories", 300, 0, 0.0, 214.13333333333327, 166, 691, 193.0, 292.90000000000003, 305.9, 317.97, 0.004467938985765638, 0.010048499496306899, 6.893890231943074E-4], "isController": false}, {"data": ["Condition", 300, 0, 0.0, 319.82333333333344, 157, 630, 318.0, 464.90000000000003, 488.0, 545.7800000000002, 0.004467915563246659, 0.005676521628695218, 6.457534212504936E-4], "isController": false}, {"data": ["All", 300, 0, 0.0, 820.0033333333332, 434, 1568, 857.5, 1027.9, 1062.95, 1097.94, 0.0044678473598670845, 0.008686996185054068, 8.071794546634871E-4], "isController": false}, {"data": ["TopDiscounted1", 300, 0, 0.0, 472.4800000000002, 186, 911, 549.5, 613.0, 626.0, 641.99, 0.004467837112905103, 0.0986240137696357, 7.591832594194218E-4], "isController": false}, {"data": ["Featured", 300, 0, 0.0, 577.0400000000001, 219, 1421, 539.0, 777.9000000000001, 807.75, 1213.5700000000022, 0.004467869717038195, 0.05259806896306582, 7.460993375132142E-4], "isController": false}, {"data": ["City", 300, 0, 0.0, 268.82333333333355, 157, 630, 247.0, 391.0, 405.0, 486.93000000000006, 0.00446792973650295, 0.005785619951760657, 6.239394065624237E-4], "isController": false}, {"data": ["Json", 300, 0, 0.0, 473.62666666666655, 313, 1319, 392.0, 845.9000000000001, 895.95, 1063.6800000000003, 0.004467868585866425, 0.004123208593197601, 9.20625265251773E-4], "isController": false}, {"data": ["Random1", 300, 0, 0.0, 649.6833333333329, 307, 874, 688.0, 781.9000000000001, 820.9, 860.9000000000001, 0.004467844698313999, 0.07527432601352685, 8.115421034046912E-4], "isController": false}, {"data": ["randomCount", 300, 0, 0.0, 545.3433333333338, 356, 710, 570.0, 646.0, 655.0, 675.97, 0.004467839242140088, 0.05163391059156694, 7.853623667824374E-4], "isController": false}, {"data": ["TopDiscounted", 300, 0, 0.0, 537.2199999999997, 367, 1165, 557.5, 621.0, 636.0, 694.6100000000004, 0.004467825202534335, 0.09862375085750597, 7.330025722907893E-4], "isController": false}, {"data": ["MostViewed", 300, 0, 0.0, 388.3266666666667, 162, 813, 350.5, 582.7, 609.95, 658.7800000000002, 0.004467852483365701, 0.08808301360760427, 7.591858711969062E-4], "isController": false}, {"data": ["Random", 300, 0, 0.0, 608.5033333333334, 307, 863, 632.0, 741.0, 758.95, 783.95, 0.004467861199994245, 0.07524019335834711, 7.853662265614886E-4], "isController": false}, {"data": ["Top10Listed", 300, 0, 0.0, 312.49999999999994, 164, 513, 309.5, 463.90000000000003, 483.84999999999997, 509.97, 0.004467893737938642, 0.014948246041189247, 7.155611064667357E-4], "isController": false}, {"data": ["MostViewed1", 300, 0, 0.0, 361.40333333333325, 161, 1087, 329.0, 578.8000000000001, 596.0, 646.8600000000001, 0.004467867255076841, 0.08808330482958132, 7.853672909314761E-4], "isController": false}, {"data": ["randomCount1", 300, 0, 0.0, 568.8100000000003, 357, 781, 575.5, 677.8000000000001, 705.95, 742.8800000000001, 0.004467839441755972, 0.05155822723294387, 8.115411486002059E-4], "isController": false}, {"data": ["Home", 300, 0, 0.0, 485.1699999999999, 451, 575, 478.5, 527.9000000000001, 542.95, 558.0, 0.0044679239474155735, 0.005366744585274566, 7.112027377233775E-4], "isController": false}, {"data": ["searchSuggestions", 300, 0, 0.0, 267.42, 156, 398, 273.0, 331.80000000000007, 361.0, 383.96000000000004, 0.004467908310300521, 0.005432173678050927, 7.591953574143464E-4], "isController": false}]}, function(index, item){
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
