/**
 * Created by bikramkawan on 12/13/17.
 */
import $ from 'jquery';
import moment from 'moment';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap-datetimepicker-npm/build/js/bootstrap-datetimepicker.min';
import 'bootstrap/js/collapse';
import 'bootstrap/js/transition';
import 'bootstrap-datetimepicker-npm/build/css/bootstrap-datetimepicker.css';
import LineChart from './renderers/LineChart';
import BarChart from './renderers/BarChart';
import HeatMap from './renderers/HeatMap';
import PieChart from './renderers/PieChart';
import Table from './renderers/Table';
import TopScore from './renderers/TopScore';
import { formatInitialData, formatRawData } from './utils/utils';
import 'bootstrap/dist/css/bootstrap.css';
import './style.less';
import * as d3 from 'd3';
import DatePicker from './renderers/DatePicker';
import SvgGenerator from './renderers/SvgGenerator';

d3.json('data/newdata.json', (err, rawData) => {
    console.error(rawData, 'dafafasjfalsf');
    const data = formatInitialData(rawData);
    //Replace data with randomdata inside the format raw data

    const datePicker = new DatePicker();
    datePicker.appendDatePicker();

    const formattedData = formatRawData(data);

    const multipleData = [rawData, rawData, rawData, rawData];
    const formattedMultipleDataSource = multipleData
        .map(d => formatInitialData(d))
        .map(d => formatRawData(d));

    const svg = new SvgGenerator();
    const {
        width,
        height,
        lineWidth,
        lineHeight,
        heatWidth,
        heatHeight,
        pieElHeight,
        pieElWidth,
        barWidth,
        barHeight,
        margin,
        heatMapMargin,
    } = svg.getDimension();

    const { lineSVG, barSVG } = svg.getSvg();

    const heatConfig = {
        margin: heatMapMargin,
        width: heatWidth,
        height: heatHeight,
        data: formattedData,
    };
    //
    const heatMap = new HeatMap(heatConfig);
    heatMap.draw();
    const getHeatData = heatMap.getData();

    const randomDataForLine = data.map(d => ({
        time: d.time,
        count: 0.8 * d.count,
    }));

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
        data: formattedMultipleDataSource,
        margin,
        width,
        height,
        barSVG,
    };

    const barChart = new BarChart(barChartConfig);
    barChart.draw();

    const pieChartConfig = formattedMultipleDataSource.map(
        (singlePieData, index) => {
            return {
                data: singlePieData,
                margin,
                width: pieElWidth,
                height: pieElHeight,
                selector: `pie${index + 1}`,
            };
        },
    );
    const pieCharts = [];
    pieChartConfig.forEach(pie => {
        const pieChart = new PieChart(pie);
        pieChart.draw();
        pieCharts.push(pieChart);
    });

    const tableViews = formattedMultipleDataSource.map(
        (singleTableView, index) => {
            return {
                data: singleTableView,
                selector: `timeBody${index + 1}`,
            };
        },
    );

    tableViews.forEach(table => {
        const tableView = new Table(table);
        tableView.draw();
    });

    // const topScores = formattedMultipleDataSource.map((data, index) => {
    //     return {
    //         data,
    //         selector: `score${index + 1}`,
    //     };
    // });
    //
    // topScores.forEach(score => {
    //     const topScore = new TopScore(score);
    //     topScore.updateScores();
    // });

    const topScore = new TopScore({ data: formattedMultipleDataSource });
    topScore.updateScores();

    formattedMultipleDataSource.forEach((source, index) => {
        d3.select(`.source${index + 1}`).text(`Data Source ${index + 1}`);
    });

    window.addEventListener('resize', function(d) {
        const updateHeight = lineEl.clientHeight;
        const updateWidth = lineEl.clientWidth;
        lineChart.updateDimension(updateHeight, updateWidth);
        barChart.updateDimension(barEl.clientHeight, barEl.clientWidth);
        pieCharts.forEach(pie => {
            pie.updateDimension(pieEl.clientHeight, pieEl.clientWidth);
        });

        heatMap.updateDimension(heatEl.clientHeight, heatEl.clientWidth);
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
