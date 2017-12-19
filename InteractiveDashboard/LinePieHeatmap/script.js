/**
 * Created by bikramkawan on 12/13/17.
 */

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const heatMapMargin = { top: 50, right: 0, bottom: 100, left: 30 };
const heatmapWidth = 960;
const heatMapHeight = 430;
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
    const data = rawData.message.map(d => ({
        time: dateParse(d.time),
        count: d.wifiCount,
    }));

    const randomData = d3.timeHour
        .range(new Date(2016, 6, 1), new Date(2017, 12, 30), 1)
        .map(d => ({
            time: d,
            count: Math.random() * 100,
        }));

    //Replace data with randomdata inside the format raw data
    const formattedData = formatRawData(data);

    console.log(formattedData, 'formatted data', data,'rawdata');

    const heatConfig = {
        margin: heatMapMargin,
        width: heatmapWidth,
        height: heatMapHeight,
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

    const tableView = new Table(formattedData);
    tableView.draw();

    const pieChartConfig = { data: formattedData, margin, width, height };
    const pieChart = new PieChart(pieChartConfig);
    pieChart.draw();

    const topScore = new TopScore(formattedData);
    topScore.updateScores();

    const uniqueYears = [{ year: 'All' }].concat(
        _.uniqBy(formattedData, 'year'),
    );

    let selectedYear = null;
    let selectedMonth = null;
    let selectedWeek = null;

    const yearSelect = d3
        .select('.year')
        .append('select')
        .attr('class', 'yearSelect')
        .on('change', () => {
            selectedYear = d3.select('.yearSelect').property('value');
            filterData();
        });

    yearSelect
        .selectAll('option')
        .data(uniqueYears)
        .enter()
        .append('option')
        .text(d => d.year);

    const month = [
        { label: 'All', id: -1 },
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
            selectedMonth = d3.select('.monthSelect').property('value');
            filterData();
        });

    monthSelect
        .selectAll('option')
        .data(month)
        .enter()
        .append('option')
        .text(d => d.label);

    const weeks = ['All'].concat(Array.from({ length: 52 }, (v, i) => i + 1));
    const weekSelect = d3
        .select('.week')
        .append('select')
        .attr('class', 'weekSelect')
        .on('change', () => {
            selectedWeek = d3.select('.weekSelect').property('value');
            filterData();
        });

    weekSelect
        .selectAll('option')
        .data(weeks)
        .enter()
        .append('option')
        .text(d => d);

    function filterData() {
        let filtered = getHeatData;
        if (selectedYear && selectedYear !== 'All') {
            filtered = filtered.filter(
                d => d.year === parseFloat(selectedYear),
            );
        }
        if (selectedMonth && selectedMonth !== 'All') {
            const monthId = month.find(d => d.label === selectedMonth);
            filtered = filtered.filter(d => d.month === monthId.id);
        }
        if (selectedWeek && selectedWeek !== 'All') {
            filtered = filtered.filter(
                d => d.week === parseFloat(selectedWeek),
            );
        }

        if (filtered.length > 0) {
            heatMap.update(filtered);
            lineChart.update(filtered);
            barChart.update(filtered);
            tableView.update(filtered);
            pieChart.update(filtered);
        } else {
            alert('No Data Found in this Range');
        }
    }
});

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
