/**
 * Created by bikramkawan on 12/13/17.
 */

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
import axios from 'axios';

const DEVICE_URL = 'https://ebs-granite.bigbang.io/api/v1/devices';

const beaconReaderId = 'device-id-8f373a31-a510-4a3f-9472-4a0f5bb56245';
const timeInterval = 60;
const startDateTime = '2018-08-09T05:00:00Z';
const endDateTime = '2018-08-11T23:44:19Z';
const intervalType = [
    {
        type: 'day',
        timeInterval: 60,
    },
    {
        type: 'week',
        timeInterval: 10080,
    },
    {
        type: 'month',
        timeInterval: 43800,
    },
];
function fetchDeviceData({ beaconReaderId, timeInterval, type }) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'https://ebs-granite.bigbang.io/api/v1/call',
            data: {
                id: 'granite1',
                namespace: '/deviceCountByTimeInterval',
                message: {
                    beaconReaderId,
                    timeInterval,
                    startDateTime,
                    endDateTime,
                },
            },
            headers: {
                'Postman-Token': '9637ee41-e18d-4683-aabc-acd703e0ab94',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                Authorization: 'Bearer at_4d114c8e-4867-414f-9d65-76c4a9b8bb0b',
            },
        })
            .then(res => {
                resolve({ data: res.data, type });
            })
            .catch(e => reject(e));
    });
}

axios
    .get(DEVICE_URL)
    .then(response => {
        console.error(response);
        const devices = response.data && response.data.devices;

        const promises = devices
            .map(device =>
                intervalType.map(it =>
                    fetchDeviceData({
                        beaconReaderId: device.id,
                        timeInterval: 60,
                        type: it.type,
                    }),
                ),
            )
            .reduce((a, b) => a.concat(b), []);
        Promise.all(promises).then(response => {
            console.log(response);
            const day = response
                .filter(r => r.type === 'day')
                .filter(d => d.data.message.results.length > 0);
            const week = response
                .filter(r => r.type === 'week')
                .filter(d => d.data.message.results.length > 0);
            const month = response
                .filter(r => r.type === 'month')
                .filter(d => d.data.message.results.length > 0);

            console.error(day, week, month);

            initApp({day,week,month})
        });
        console.log(devices, 'devices  list', promises);
    })
    .catch(e => {
        console.log(e, 'Error occured');
    });

d3
    .queue()
    .defer(d3.json, 'data/new/oneDayExample.json')
    .defer(d3.json, 'data/new/getDeviceIdExample.json')
    .defer(d3.json, 'data/newdata.json')
    .awaitAll(ready);


function initApp({day,week,month}) {




}



function ready(error, results) {
    console.error(results, 'dafafasjfalsf');
    const rawData = results[2];
    const data = formatInitialData(rawData);
    //Replace data with randomdata inside the format raw data
    const formattedData = formatRawData(data);

    const multipleData = [rawData, rawData, rawData, rawData];
    const formattedMultipleDataSource = multipleData
        .map(d => formatInitialData(d))
        .map(d => formatRawData(d));

    const svg = new SvgGenerator();
    const {
        width,
        height,
        heatWidth,
        heatHeight,
        pieElHeight,
        pieElWidth,
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

    const tablePies = [];
    tableViews.forEach(table => {
        const tableView = new Table(table);
        tableView.draw();
        tablePies.push(tableView);
    });

    const topScore = new TopScore({ data: formattedMultipleDataSource });
    topScore.updateScores();

    formattedMultipleDataSource.forEach((source, index) => {
        d3.select(`.source${index + 1}`).text(`Data Source ${index + 1}`);
    });

    const datePicker = new DatePicker({
        heatMap,
        lineChart,
        barChart,
        pieCharts,
        tablePies,
    });

    svg.attachResizer({
        heatMap,
        lineChart,
        barChart,
        pieCharts,
        tablePies,
    });
    datePicker.appendDatePicker();
}

const data = {
    id: 'granite1',
    namespace: 'deviceCountByTimeInterval',
    message: {
        beaconReaderId: 'device-id-8f373a31-a510-4a3f-9472-4a0f5bb56245',
        timeInterval: 60,
        startDateTime: '2018-07-15T00:00:00Z',
        endDateTime: '2018-07-15T23:59:00Z',
    },
};
