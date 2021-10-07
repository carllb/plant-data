/*global
console
*/

var files_by_date = {};

function list_file(file_list){
    "use strict";

    console.log(file_list);

    file_list.forEach((file,idx) => {
        if (files_by_date[file[0]]){
            if (files_by_date[file[0]][file[1]]){
                files_by_date[file[0]][file[1]].push([file[2],idx]);
            } else {
                files_by_date[file[0]][file[1]] = [[file[2],idx]];
            }
        } else {
            var new_year = {};
            var new_month = [[file[2], idx]];
            new_year[file[1]] = new_month;
            files_by_date[file[0]] = new_year;
        }
    });

    console.log(files_by_date);

    var year_select = document.getElementById('year_select');

    year_select.options.length = 0;

    Object.keys(files_by_date).forEach( year =>{
        var opt = document.createElement('option');
        opt.value = year;
        opt.innerHTML = year;
        year_select.appendChild(opt);
    });

}

function on_year_change() {
    var year_list = [];
    var year_select = document.getElementById('year_select');
    var month_select = document.getElementById('month_select');

    month_select.options.length = 0;

    for (var iYear = 0; iYear < year_select.options.length; iYear++){
        if(year_select.options[iYear].selected) {
            year_list.push(year_select.options[iYear].value);
        }
    }

    year_list.forEach( year =>{
        Object.keys(files_by_date[year]).forEach( month =>{
            var opt = document.createElement('option');
            opt.value = JSON.stringify([month, year]);
            opt.innerHTML = year + '-' + month;
            month_select.appendChild(opt);
        });
    });
}

function on_month_change() {
    var month_list = [];
    var month_select = document.getElementById('month_select');
    var day_select = document.getElementById('day_select');

    day_select.options.length = 0;

    for (var iMonth = 0; iMonth < month_select.options.length; iMonth++){
        if(month_select.options[iMonth].selected) {
            month_list.push(JSON.parse(month_select.options[iMonth].value));
        }
    }

    month_list.forEach( month =>{
        files_by_date[Number(month[1])][month[0]].forEach( day =>{
            var opt = document.createElement('option');
            opt.value = JSON.stringify(day);
            opt.innerHTML = month[1] + '-' + month[0] + '-' + day[0];
            day_select.appendChild(opt);
        });
    });
}

function on_view_data() {
    const xhr = new XMLHttpRequest();
    const data = new FormData();

    var day_list = [];

    var day_select = document.getElementById('day_select');
    for (var iDay = 0; iDay < day_select.options.length; iDay++){
        if(day_select.options[iDay].selected) {
            const day = JSON.parse(day_select.options[iDay].value);
            day_list.push(day[1]);
        }
    }

    data.append('selected_days', JSON.stringify(day_list));
    xhr.addEventListener('load', recv_graph_data);
    xhr.open('POST', '/req_data');
    xhr.send(data);
}

function recv_graph_data(target) {
    plant_data = JSON.parse(target.currentTarget.responseText)
    console.log('The plant data: ', plant_data);

    var o2_trace = {
        x: plant_data[0],
        y: plant_data[1]['o2'],
        mode: 'lines',
        type: 'scatter'
    };

    var co2_trace = {
        x: plant_data[0],
        y: plant_data[1]['co2'],
        mode: 'lines',
        type: 'scatter'
    };

    var temp_trace = {
        x: plant_data[0],
        y: plant_data[1]['temp'],
        mode: 'lines',
        type: 'scatter'
    };

    var hum_trace = {
        x: plant_data[0],
        y: plant_data[1]['hum'],
        mode: 'lines',
        type: 'scatter'
    };

    showGraphs()
    Plotly.newPlot('o2_plot', [o2_trace])
    Plotly.newPlot('co2_plot', [co2_trace])
    Plotly.newPlot('temp_plot', [temp_trace])
    Plotly.newPlot('hum_plot', [hum_trace])
}

function showGraphs() {
    document.getElementById('plots').classList.remove('empty');
}