const rawdata = [
    {
        'Shift Start': 'Mon',
        'Shift Colour': 'Red',
        Efficiency: '69',
        Target: '70',
    },
    {
        'Shift Start': 'Mon',
        'Shift Colour': 'Blue',
        Efficiency: '55',
        Target: '70',
    },
    {
        'Shift Start': 'Mon',
        'Shift Colour': 'Gold',
        Efficiency: '75',
        Target: '70',
    },
    {
        'Shift Start': 'Tue',
        'Shift Colour': 'Red',
        Efficiency: '78',
        Target: '70',
    },
    {
        'Shift Start': 'Tue',
        'Shift Colour': 'Blue',
        Efficiency: '70',
        Target: '70',
    },
    {
        'Shift Start': 'Tue',
        'Shift Colour': 'Gold',
        Efficiency: '60',
        Target: '70',
    },
    {
        'Shift Start': 'Wed',
        'Shift Colour': 'Red',
        Efficiency: '78',
        Target: '70',
    },
    {
        'Shift Start': 'Wed',
        'Shift Colour': 'Blue',
        Efficiency: '56',
        Target: '70',
    },
    {
        'Shift Start': 'Wed',
        'Shift Colour': 'Gold',
        Efficiency: '69',
        Target: '70',
    },
    {
        'Shift Start': 'Thu',
        'Shift Colour': 'Red',
        Efficiency: '52',
        Target: '70',
    },
    {
        'Shift Start': 'Wed',
        'Shift Colour': 'Blue',
        Efficiency: '61',
        Target: '70',
    },
    {
        'Shift Start': 'Wed',
        'Shift Colour': 'Gold',
        Efficiency: '79',
        Target: '70',
    },
    {
        'Shift Start': 'Fri',
        'Shift Colour': 'Red',
        Efficiency: '53',
        Target: '70',
    },
    {
        'Shift Start': 'Fri',
        'Shift Colour': 'Blue',
        Efficiency: '72',
        Target: '70',
    },
    {
        'Shift Start': 'Fri',
        'Shift Colour': 'Gold',
        Efficiency: '54',
        Target: '70',
    },
];

const data = rawdata.map((d, i) => {
    return {
        ...d,
        category: `${d['Shift Colour']}-${i}`,
        label: d['Shift Colour'],
    };
});
const target = parseFloat(data[0].Target);
const svg = d3.select('svg'),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr('width') - margin.left - margin.right,
    barHeight = +svg.attr('height') - margin.top - margin.bottom;

const height = barHeight - 40;

const x = d3.scaleBand().rangeRound([0, width]);
const bingaps = 15;
const availableWidth = width - bingaps * data.length - 1;

const bindWidth = availableWidth / data.length;
console.error(availableWidth, 'width', width, bindWidth);
y = d3.scaleLinear().rangeRound([height, 0]);

const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

y.domain([0, d3.max(data, d => d.Efficiency)]);

g
    .append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).tickFormat(d => d + ' %'));

g
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => bingaps * i + bindWidth * i)
    .attr('y', d => y(d.Efficiency))
    .attr('width', bindWidth)
    .attr('height', d => height - y(d.Efficiency))
    .attr('fill', d => (d.Efficiency > d.Target ? 'green' : 'red'));

console.error(height, barHeight, 'he');
const labels = g
    .append('g')
    .classed('labels', true)
    .attr('transform', 'translate(0,' + (height + 20) + ')');

labels
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d.label)
    .attr('x', (d, i) => {
        const xVal = bingaps * i + bindWidth * i;
        return -10 + xVal + bindWidth / 3;
    });

const collectShiftStart = _.uniqBy(data, d => d['Shift Start']);

const days = g
    .append('g')
    .classed('days', true)
    .attr('transform', 'translate(0,' + (height + 40) + ')');

const size = width / collectShiftStart.length;

days
    .selectAll('text')
    .data(collectShiftStart)
    .enter()
    .append('text')
    .text(d => d['Shift Start'])
    .attr('x', (d, i) => {
        return -25 + size / 2 + size * i;
    });

const targetLine = g.append('g').classed('target', true);
const path = `M0 ${y(target)} L${width} ${y(target)}`;
targetLine
    .append('path')
    .attr('d', path)
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('stroke', 'orange');

const targetLegend = g
    .append('g')
    .classed('target', true)
    .attr('transform', 'translate(0,' + (height + 60) + ')');

targetLegend
    .append('text')
    .text('Target')
    .attr('x', width / 2);
const offset = width / 2 + 50;
targetLegend
    .append('path')
    .attr('d', `M ${offset} ${0} L ${offset + 50} ${0}`)
    .attr('stroke-width', 3)
    .attr('stroke', 'orange');
