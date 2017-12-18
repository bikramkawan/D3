/**
 * Created by bikramkawan on 12/13/17.
 */
const rawData = {
    id: 'unittest',
    message: [
        {
            time: '2017-11-19T18:00:00.000Z',
            wifiCount: 71.66666666666667,
        },
        { time: '2017-11-19T19:00:00.000Z', wifiCount: 75.13333333333334 },
        {
            time: '2017-11-19T20:00:00.000Z',
            wifiCount: 77.61666666666666,
        },
        { time: '2017-11-19T21:00:00.000Z', wifiCount: 73.18333333333334 },
        {
            time: '2017-11-19T22:00:00.000Z',
            wifiCount: 74.33333333333333,
        },
        { time: '2017-11-19T23:00:00.000Z', wifiCount: 72.76666666666667 },
        {
            time: '2017-11-20T00:00:00.000Z',
            wifiCount: 70.38333333333334,
        },
        { time: '2017-11-20T01:00:00.000Z', wifiCount: 70.5 },
        {
            time: '2017-11-20T02:00:00.000Z',
            wifiCount: 69.41666666666667,
        },
        { time: '2017-11-20T03:00:00.000Z', wifiCount: 71.28333333333333 },
        {
            time: '2017-11-20T04:00:00.000Z',
            wifiCount: 69.43333333333334,
        },
        { time: '2017-11-20T05:00:00.000Z', wifiCount: 70.85 },
        {
            time: '2017-11-20T06:00:00.000Z',
            wifiCount: 70.01666666666667,
        },
        { time: '2017-11-20T07:00:00.000Z', wifiCount: 69.1 },
        {
            time: '2017-11-20T08:00:00.000Z',
            wifiCount: 69.81666666666666,
        },
        { time: '2017-11-20T09:00:00.000Z', wifiCount: 68.48333333333333 },
        {
            time: '2017-11-20T10:00:00.000Z',
            wifiCount: 72.4,
        },
        { time: '2017-11-20T11:00:00.000Z', wifiCount: 72.03333333333333 },
        {
            time: '2017-11-20T12:00:00.000Z',
            wifiCount: 75.23333333333333,
        },
        { time: '2017-11-20T13:00:00.000Z', wifiCount: 89.41666666666667 },
        {
            time: '2017-11-20T14:00:00.000Z',
            wifiCount: 117.01666666666667,
        },
        { time: '2017-11-20T15:00:00.000Z', wifiCount: 144.85 },
        {
            time: '2017-11-20T16:00:00.000Z',
            wifiCount: 141.06666666666666,
        },
        { time: '2017-11-20T17:00:00.000Z', wifiCount: 147.41666666666666 },
    ],
};
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const dateParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
const data = rawData.message.map(d => ({
    time: dateParse(d.time),
    count: d.wifiCount,
}));

const randomData = data.map(d => ({ time: d.time, count: 0.8 * d.count }));

console.log(data, 'main');
console.log(d3.max(data,d=>d.time))
const randomDate = d3.timeDay.range(
    new Date(2017, 1, 1),
    new Date(2017, 1, 30),
    1,
);

const randBarData = randomDate.map(d => ({
    time: d,
    count: Math.random() * 100,
}));

const lineEl = document.querySelector('.line');
const lineWidth = lineEl.clientWidth;
const lineHeight = lineEl.clientHeight;

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
const line1Config = { data, lineSVG, width, height, margin, randomData };
const line1 = new LineChart(line1Config);
line1.draw();

const barConfig = { data: randBarData, margin, width, height, barSVG };
console.log(barConfig);
const bar = new BarChart(barConfig);
bar.draw();

const table = new Table(data);
table.draw();

const pieConfig = { data, margin, width, height };
const pie = new PieChart(pieConfig);
pie.draw();

const heatMapMargin = { top: 50, right: 0, bottom: 100, left: 30 };
const heatmapWidth = 960;
const heatMapHeight = 430;
const heatConfig = {
    margin: heatMapMargin,
    width: heatmapWidth,
    height: heatMapHeight,
};
const heatmapObj = new HeatMap(heatConfig);
heatmapObj.draw();

const topScore = new TopScore();
topScore.updateScores();



const month = [
    { label: 'Jan', id: 0 },
    { label: 'Feb', id: 1 },
    { label: 'Mar', id: 2 },
    { label: 'Apr', id: 3 },
    { label: 'May', id: 4 },
    { label: 'Jun', id: 5 },
    { label: 'Jul', id: 6 },
    { label: 'Aug', id: 7 },
    { label: 'Sep', id: 8 },
    { label: 'Oct', id: 9 },
    { label: 'Nov', id: 10 },
    { label: 'Dec', id: 11 },
];

const monthSelect = d3
    .select('.month')
    .append('select')
    .attr('class', 'monthSelect')
    .on('change', () => {
        const selectValue = d3.select('.monthSelect').property('value');
        const monthId = month.find(d => d.label === selectValue);
        heatmapObj.setData({ ...monthId, filterBy: 'month' });
    });

monthSelect
    .selectAll('option')
    .data(month)
    .enter()
    .append('option')
    .text(d => d.label);

const weeks = Array.from({ length: 52 }, (v, i) => i + 1);
const weekSelect = d3
    .select('.week')
    .append('select')
    .attr('class', 'weekSelect')
    .on('change', () => {
        const selectValue = d3.select('.weekSelect').property('value');
        heatmapObj.setData({ id: selectValue, filterBy: 'week' });
    });

weekSelect
    .selectAll('option')
    .data(weeks)
    .enter()
    .append('option')
    .text(d => d);
