const width = 700;
const height = 200;
const maxPercentage = 100;

const color = {
    ignored: '#B4C3CA',
    skimmed: '#76E49C',
    read: '#3ED772',
    other1: '#2CC7B4',
    other2: '#2CC7B4',
};

const opacityAdjust = 0.2;
const newData = [
    [
        {
            label: 'ignored',
            value: { percentage: 10, clicked: 0 },
        },
        {
            label: 'skimmed',
            value: { percentage: 37, clicked: 5 },
        },
        {
            label: 'read',
            value: { percentage: 24, clicked: 10 },
        },
    ],
    [
        {
            label: 'ignored',
            value: { percentage: 50, clicked: 0 },
        },
        {
            label: 'skimmed',
            value: { percentage: 40, clicked: 10 },
        },
        {
            label: 'read',
            value: { percentage: 35, clicked: 15 },
        },
    ],
    [
        {
            label: 'ignored',
            value: { percentage: 15, clicked: 0 },
        },
        {
            label: 'skimmed',
            value: { percentage: 47, clicked: 25 },
        },
        {
            label: 'read',
            value: { percentage: 34, clicked: 27 },
        },
    ],
];

const dataWithColorAdjust = newData.map((item, index) => {
    return item.map(d => {
        return {
            ...d,
            opacity: 1 - opacityAdjust * index,
        };
    });
});

const app = d3
    .select('.heatmap-container')
    .selectAll('div')
    .data(dataWithColorAdjust);
const heatmapEnter = app
    .enter()
    .append('div')
    .classed('heatmap', true)
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('position', 'absolute')
    .style('opacity', (d, i) => 1 - 0.2 * i);

const itemScale = d3.scale
    .linear()
    .domain([0, maxPercentage])
    .range([0, width]);
const clickedHeightScale = d3.scale
    .linear()
    .range([0, 0.8 * height])
    .domain([0, maxPercentage]);

const itemColumn = heatmapEnter
    .selectAll('.col')
    .data(d => {
        return d;
    })
    .enter()
    .append('div')
    .classed('col', true)
    .style('width', d => `${itemScale(d.value.percentage)}px`);

const topContainer = itemColumn
    .append('div')
    .classed('top', true)
    .style('background', (d, i) => {
        return color[d.label];
    })
    .style('opacity', d => d.opacity);

const labels = newData
    .map(d => d.map(e => e.label))
    .reduce((c, b) => c.concat(b), []);
const uniq = _.uniq(labels);

const filterBy = uniq
    .map(u => newData.map(d => d.filter((e, i) => e.label === u)))
    .reduce((c, b) => c.concat(b), [])
    .reduce((c, b) => c.concat(b), []);
const filteredAndSum = uniq.map(u => filterBy.filter(f => f.label === u));
const totalSumScore = filteredAndSum.map(d => ({
    label: d[0].label,
    percentage: _.sumBy(d, o => o.value.percentage),
}));

const bottomContainer = d3
    .select('.heatmap-container')
    .append('div')
    .classed('bottom', true)
    .style('width', `${width}px`)
    .style('height', `${100}px`)
    .style('position', 'relative')
    .style('top', `${height}px`);

const scoreCol = bottomContainer
    .selectAll('.scoreCol')
    .data(totalSumScore)
    .enter()
    .append('div')
    .classed('scoreCol', true)
    .style('background', d => color[d.label]);

scoreCol
    .append('div')
    .classed('label', true)
    .text(d => d.label);

scoreCol
    .append('div')
    .classed('perc', true)
    .text(d => `${d.percentage} %`);

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
    // .text(d => `${d.value.clicked}%`)
    .attr('title', d => `Clicked (${d.value.clicked}%)`);
