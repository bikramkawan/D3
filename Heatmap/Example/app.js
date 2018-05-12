const width = 700;
const height = 200;
const maxPercentage = 100;
d3
    .select('.heatmap')
    .style('width', `${width}px`)
    .style('height', `${height}px`);

const data = [
    {
        label: 'ignored',
        color: '#B4C3CA',
        value: { percentage: 4, clicked: 30 },
    },
    {
        label: 'skimmed',
        color: '#76E49C',
        value: { percentage: 20, clicked: 5 },
    },
    {
        label: 'read',
        color: '#3ED772',
        value: { percentage: 37, clicked: 50 },
    },

    {
        label: 'other1',
        color: '#2CC7B4',
        value: { percentage: 24, clicked: 20 },
    },

    {
        label: 'other2',
        color: '#2CC7B4',
        value: { percentage: 15, clicked: 15 },
    },
];

const itemScale = d3.scale
    .linear()
    .domain([0, maxPercentage])
    .range([0, width]);
const clickedHeightScale = d3.scale
    .linear()
    .range([0, 0.8 * height])
    .domain([0, maxPercentage]);

const itemColumn = d3
    .select('.heatmap')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .classed('col', true)
    .style('width', d => `${itemScale(d.value.percentage)}px`);

const topContainer = itemColumn
    .append('div')
    .classed('top', true)
    .style('background', d => d.color);
const bottomContainer = itemColumn
    .append('div')
    .classed('bottom', true)
    .attr('title', d => `${d.label}(${d.value.percentage}%)`);

bottomContainer
    .append('div')
    .classed('label', true)
    .text(d => d.label);

bottomContainer
    .append('div')
    .classed('perc', true)
    .text(d => `${d.value.percentage} %`);

const calculateClicked = item => {
    const clickedWidthScale = d3.scale
        .linear()
        .range([0, itemScale(item.value.percentage)])
        .domain([0, maxPercentage]);
    return `${clickedWidthScale(item.value.clicked)}px`;
};
topContainer
    .append('div')
    .classed('inset', true)
    .style('width', d => calculateClicked(d))
    .style('height', d => `${clickedHeightScale(d.value.clicked)}px`)
    .text(d => `${d.value.clicked}%`)
    .attr('title', d => `Clicked (${d.value.clicked}%)`);
