class CombinedHeatMap {
    constructor({ newData, color }) {
        this.data = newData;
        this.color = color;
    }

    draw() {
        const newData = this.data;
        const color = this.color;
        const width = 700;
        const height = 200;
        const maxPercentage = 100;

        const opacityAdjust = 0.2;

        const groupByHeatmap = _.groupBy(newData, d => d.category);

        const uniquesHeatmap = _.uniqBy(newData, d => d.category).map(
            d => d.category,
        );

        const parseDateHeatmap = d3.time.format('%d-%b-%y').parse;

        const heatmapData = groupByHeatmap[uniquesHeatmap[0]].map(d => {
            const obj = {};
            obj['date'] = parseDateHeatmap(d.date);
            obj['values'] = uniquesHeatmap.map(c => {
                return groupByHeatmap[c].filter(e => e.date === d.date)[0];
            });

            return obj;
        });

        const dataWithColorAdjust = heatmapData.map((item, index) => {
            return item.values.map(d => {
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
            .style('width', d => `${itemScale(d.percentage)}px`);

        const topContainer = itemColumn
            .append('div')
            .classed('top', true)
            .style('background', (d, i) => {
                return color[d.label];
            })
            .style('opacity', d => d.opacity);

        const labels = heatmapData
            .map(d => d.values.map(e => e.category))
            .reduce((c, b) => c.concat(b), []);
        const uniq = _.uniq(labels);

        const filterBy = uniq
            .map(u =>
                heatmapData.map(d =>
                    d.values.filter((e, i) => e.category === u),
                ),
            )
            .reduce((c, b) => c.concat(b), [])
            .reduce((c, b) => c.concat(b), []);

        const filteredAndSum = uniq.map(u =>
            filterBy.filter(f => f.category === u),
        );
        const totalSumScore = filteredAndSum.map(d => ({
            label: d[0].category,
            percentage: _.sumBy(d, o => o.percentage),
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
            .text(d => d.category);

        scoreCol
            .append('div')
            .classed('perc', true)
            .text(d => `${d.percentage} %`);

        const calculateClicked = item => {
            const clickedWidthScale = d3.scale
                .linear()
                .range([0, itemScale(item.percentage)])
                .domain([0, maxPercentage]);
            return `${clickedWidthScale(item.clicked)}px`;
        };
        topContainer
            .append('div')
            .classed('inset', true)
            .style('width', d => calculateClicked(d))
            .style('height', d => `${clickedHeightScale(d.clicked)}px`)
            // .text(d => `${d.value.clicked}%`)
            .attr('title', d => `Clicked (${d.clicked}%)`);
    }
}
