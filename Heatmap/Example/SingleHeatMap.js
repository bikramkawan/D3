class SingleHeatMap {
    constructor({ data }) {
        this.data = data;
    }

    draw() {
        const groupByHeatmap = _.groupBy(this.data, d => d.category);

        const uniquesHeatmap = _.uniqBy(this.data, d => d.category).map(
            d => d.category,
        );

        const data = uniquesHeatmap.map(id => {
            const item = groupByHeatmap[id];
            const totalPerc = _.sumBy(item, 'percentage');
            const totalClicked = _.sumBy(item, 'clicked');
            return {
                label: item[0].category,
                color: color[item[0].category],
                value: { percentage: totalPerc, clicked: totalClicked },
            };
        });
        const width = 700;
        const height = 200;
        const maxPercentage = 100;
        d3
            .select('.singleHeatmap-container')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

        const itemScale = d3.scale
            .linear()
            .domain([0, maxPercentage])
            .range([0, width]);
        const clickedHeightScale = d3.scale
            .linear()
            .range([0, 0.8 * height])
            .domain([0, maxPercentage]);

        const itemColumn = d3
            .select('.singleHeatmap-container')
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
    }
}
