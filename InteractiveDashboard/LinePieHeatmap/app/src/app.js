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

d3.json('data/newdata.json', (err, rawData) => {
    console.error(rawData, 'dafafasjfalsf');
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
});