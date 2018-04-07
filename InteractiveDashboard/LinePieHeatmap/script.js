/**
 * Created by bikramkawan on 12/13/17.
 */

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const heatMapMargin = { top: 50, right: 0, bottom: 100, left: 30 };
// const heatmapWidth = 960;
// const heatMapHeight = 430;
const colors = ['blue', 'green', 'yellow', 'red']; // alternatively colorbrewer.YlGnBu[9]
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const times = [
    '1a',
    '2a',
    '3a',
    '4a',
    '5a',
    '6a',
    '7a',
    '8a',
    '9a',
    '10a',
    '11a',
    '12a',
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '10p',
    '11p',
    '12p',
];
const dateParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');

d3.json('data.json', (err, rawData) => {
    const data = formatInitialData(rawData);

    //Replace data with randomdata inside the format raw data
    const formattedData = formatRawData(data);

    console.log(formattedData, 'formatted data', data, 'rawdata');

    const heatEl = document.querySelector('.heatmap');
    const heatWidth = heatEl.clientWidth;
    const heatHeight = heatEl.clientHeight;

    const heatConfig = {
        margin: heatMapMargin,
        width: heatWidth,
        height: heatHeight,
        data: formattedData,
    };

    const heatMap = new HeatMap(heatConfig);
    heatMap.draw();
    const getHeatData = heatMap.getData();

    const randomDataForLine = data.map(d => ({
        time: d.time,
        count: 0.8 * d.count,
    }));
    const lineEl = document.querySelector('.line');
    const lineWidth = lineEl.clientWidth;
    const lineHeight = lineEl.clientHeight;

    const pieEl = document.querySelector('.pie');
    console.log(pieEl);
    const pieElWidth = pieEl.clientWidth;
    const pieElHeight = pieEl.clientHeight;
    console.log(pieElWidth);

    const barEl = document.querySelector('.bar');
    const barWidth = lineEl.clientWidth;
    const barHeight = lineEl.clientHeight;

    const lineSVG = d3
        .select('.line')
        .append('svg')
        .attr('width', lineWidth)
        .attr('height', lineHeight);
    const barSVG = d3
        .select('.bar')
        .append('svg')
        .attr('width', lineWidth)
        .attr('height', lineHeight);

    const width = lineWidth - margin.left - margin.right;
    const height = lineHeight - margin.top - margin.bottom;
    const lineChartConfig = {
        data,
        lineSVG,
        width,
        height,
        margin,
        randomDataForLine,
    };
    const lineChart = new LineChart(lineChartConfig);
    lineChart.draw();

    const barChartConfig = {
        data: formattedData,
        margin,
        width,
        height,
        barSVG,
    };

    const barChart = new BarChart(barChartConfig);
    barChart.draw();

    const pieChartConfig1 = {
        data: formattedData,
        margin,
        width: pieElWidth,
        height: pieElHeight,
        selector: 'pie1',
    };
    const pieChart1 = new PieChart(pieChartConfig1);
    pieChart1.draw();

    const tableView1 = new Table({
        data: formattedData,
        selector: 'timeBody1',
    });
    tableView1.draw();

    const pieChartConfig2 = {
        data: formattedData,
        margin,
        width: pieElWidth,
        height: pieElHeight,
        selector: 'pie2',
    };
    const pieChart2 = new PieChart(pieChartConfig2);
    pieChart2.draw();

    const tableView2 = new Table({
        data: formattedData,
        selector: 'timeBody2',
    });
    tableView2.draw();
    const pieChartConfig3 = {
        data: formattedData,
        margin,
        width: pieElWidth,
        height: pieElHeight,
        selector: 'pie3',
    };
    const pieChart3 = new PieChart(pieChartConfig3);
    pieChart3.draw();

    const tableView3 = new Table({
        data: formattedData,
        selector: 'timeBody3',
    });
    tableView3.draw();
    const pieChartConfig4 = {
        data: formattedData,
        margin,
        width: pieElWidth,
        height: pieElHeight,
        selector: 'pie4',
    };
    const pieChart4 = new PieChart(pieChartConfig4);
    pieChart4.draw();

    const tableView4 = new Table({
        data: formattedData,
        selector: 'timeBody4',
    });
    tableView4.draw();

    const topScore = new TopScore(formattedData);
    topScore.updateScores();

    window.addEventListener('resize', function(d) {
        const updateHeight = lineEl.clientHeight;
        const updateWidth = lineEl.clientWidth;
        lineChart.updateDimension(updateHeight, updateWidth);
        barChart.updateDimension(barEl.clientHeight, barEl.clientWidth);
        pieChart.updateDimension(pieEl.clientHeight, pieEl.clientWidth);
        heatMap.updateDimension(heatEl.clientHeight, heatEl.clientWidth);

        console.log(barEl.clientHeight, barEl.clientWidth, updateWidth);
    });
    const extractYear = d3.timeFormat('%Y');
    const yearsData = formattedData.slice();
    yearsData.push({ year: parseFloat(extractYear(new Date())) });
    const uniqueYears = [{ year: ' ' }].concat(_.uniqBy(yearsData, 'year'));
    const formatTime = d3.timeFormat('%Y-%m-%d');
    let selectedYear = undefined;
    let selectedMonth = undefined;
    let selectedDay = undefined;
    let fromDate = undefined;
    let toDate = undefined;
    d3
        .select('.fromdate')
        .attr('value', formatTime(_.min(formattedData, 'time').time))
        .on('change', () => {
            fromDate = d3.select('.fromdate').property('value');
            filterData();
        });

    d3
        .select('.todate')
        .attr('value', formatTime(new Date()))
        .on('change', () => {
            toDate = d3.select('.todate').property('value');
            filterData();
        });

    const days = [' '].concat(Array.from({ length: 32 }, (v, i) => i + 1));
    const daySelect = d3
        .select('.week')
        .append('select')
        .attr('class', 'weekSelect')
        .on('change', () => {
            selectedDay = d3.select('.weekSelect').property('value');
            filterData();
        });

    daySelect
        .selectAll('option')
        .data(days)
        .enter()
        .append('option')
        .text(d => d);

    const parseTime = d3.timeParse('%Y %m %d');

    function filterData() {
        if (!fromDate || !toDate) {
            return;
        }

        var dataPost = JSON.stringify({
            id: 'testunit',
            namespace: '/readerWifiCount',
            message: {
                beaconReaderId:
                    'device-id-8f373a31-a510-4a3f-9472-4a0f5bb56245',
                startDateTime: fromDate,
                endDateTime: toDate,
                timeInterval: '60',
            },
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                const responseData = JSON.parse(this.responseText);
                const formatResponse = formatInitialData(responseData);
                const renderFormat = formatRawData(formatResponse);
                if (renderFormat.length > 0) {
                    heatMap.update(renderFormat);
                    lineChart.update(formatResponse);
                    barChart.update(renderFormat);
                    tableView.update(renderFormat);
                    pieChart.update(renderFormat);
                } else {
                    alert('No Data Found in this Range');
                }
            }
        });

        xhr.open('POST', 'https://ebs-granite.bigbang.io/api/v1/call');
        xhr.setRequestHeader(
            'authorization',
            'Bearer at_1fbc4851-8c41-4c27-80a3-d0a884f9f684',
        );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader(
            'Postman-Token',
            '8d7989e0-b3de-8adb-7a3f-495cdb7605fb',
        );

        xhr.send(dataPost);
    }
});

function formatInitialData(rawData) {
    return rawData.message.map(d => ({
        time: dateParse(d.time),
        count: d.wifiCount,
    }));
}

//https://gist.github.com/IamSilviu/5899269
function parseWeek(date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}
function formatRawData(data) {
    const daysIndex = days.map((d, i) => i);
    const timeIndex = times.map((d, i) => i);
    const dataByWeek = daysIndex
        .map(d => _.groupBy(data, e => e.time.getDay() === d).true)
        .filter(d => d !== undefined);

    return dataByWeek
        .map((d, i) => {
            return timeIndex
                .map(e => {
                    let groupedBy = _.groupBy(d, f => f.time.getHours() === e)
                        .true;
                    return groupedBy
                        ? groupedBy.map((g, f) => ({
                              ...g,
                              day: i,
                              hour: groupedBy[0].time.getHours(),
                              month: g.time.getMonth(),
                              week: parseWeek(g.time) - 1,
                              year: g.time.getFullYear(),
                          }))
                        : [];
                })
                .reduce((acc, cur) => acc.concat(cur), []);
        })
        .reduce((acc, cur) => acc.concat(cur), []);
}
