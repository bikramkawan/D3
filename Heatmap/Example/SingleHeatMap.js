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
        const maxPercentage = _.sumBy(data, d => d.value.percentage);

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
            .style('background', d => d.color)
            .style('height', `${0.8 * height}px`);
        const bottomContainer = itemColumn
            .append('div')
            .classed('bottom', true)
            .style('height', `${0.2 * height}px`)
            .attr('title', d => `${d.label}(${d.value.percentage}%)`);

        bottomContainer
            .append('div')
            .classed('label', true)
            .text(d => d.label);

        bottomContainer
            .append('div')
            .classed('perc', true)
            .text(d => `${d.value.percentage} %`);

        const calculateWidth = item => {
            const clickedWidthScale =
                itemScale(item.value.percentage) * item.value.clicked / 100;

            return `${clickedWidthScale}px`;
        };

        const calculateHeight = item => {
            const clickedHeight = 0.8 * height * item.value.clicked / 100;

            return `${clickedHeight}px`;
        };
        topContainer
            .append('div')
            .classed('inset', true)
            .style('width', d => calculateWidth(d))
            .style('height', d => calculateHeight(d))
            .text(d => `${d.value.clicked}%`)
            .attr('title', d => `Clicked (${d.value.clicked}%)`);
    }
}
