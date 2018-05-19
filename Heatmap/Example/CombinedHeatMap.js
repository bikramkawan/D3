class CombinedHeatMap {
    constructor({ newData, color, correctData }) {
        this.data = newData;
        this.color = color;
        this.correctData = correctData;
    }

    draw() {
        const newData = this.data;

        const color = this.color;
        const width = 700;
        const height = 300;
        const topHeight = 0.7 * height;
        const bottomHeight = 0.2 * height;
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

        const maxPercentage = dataWithColorAdjust.map(data => {
            const percScore = _.sumBy(data, 'percentage');
            const clickedScore = _.sumBy(data, 'clicked');
            return { percScore, clickedScore };
        });

        const percentageScale = maxPercentage.map(item => {
            return d3.scale
                .linear()
                .domain([0, item.percScore])
                .range([0, width]);
        });

        const svg = d3
            .select('#combinedheatmap')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

        dataWithColorAdjust.forEach(data => {
            const maxPercentage = _.sumBy(data, 'percentage');
            const clickedScore = _.sumBy(data, 'clicked');

            const itemScale = d3.scale
                .linear()
                .domain([0, maxPercentage])
                .range([0, width]);

            const heatMapEnter = svg
                .append('g')
                .classed('heatmap', true)
                .attr('data-arrt', data[0].date);

            const gEnter = heatMapEnter
                .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .classed('item', true)
                .attr('data-arrt', d => d.category)
                .attr('transform', (d, i) => {
                    const previousArrayLength = Array.from(
                        { length: i },
                        (v, i) => i,
                    );

                    const width = _.sumBy(
                        previousArrayLength.map(d =>
                            itemScale(data[d].percentage),
                        ),
                    );

                    return `translate(${width},0)`;
                });

            gEnter
                .append('rect')
                .classed('top', true)
                .attr('width', d => itemScale(d.percentage))
                .attr('height', topHeight)
                .attr('fill', d => color[d.category])
                .attr('opacity', d => d.opacity);

            gEnter
                .append('rect')
                .classed('inset', true)
                .attr('width', d => itemScale(d.percentage) * d.clicked / 100)
                .attr('height', d => topHeight * d.clicked / 100)
                .attr('x', d => {
                    const binWidth = itemScale(d.percentage) * d.clicked / 100;
                    return itemScale(d.percentage) - binWidth;
                })
                .attr('y', d => {
                    const binHeight = topHeight * d.clicked / 100;
                    return topHeight - binHeight;
                })
                .attr('fill', '#1aa4cd')
                .append('title')
                .text(d => d.clicked);
        });

        const labelSvg = svg
            .append('g')
            .classed('label', true)
            .attr('transform', (d, i) => `translate(0,${0.75 * height})`);

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
        const binSize = width / totalSumScore.length;

        const labelEnter = labelSvg
            .selectAll('g')
            .data(totalSumScore)
            .enter()
            .append('g')
            .classed('category', true)
            .attr('transform', (d, i) => {
                return `translate(${binSize * i},${0})`;
            });

        labelEnter
            .append('rect')
            .classed('top', true)
            .attr('width', (d, i) => binSize)
            .attr('height', bottomHeight)
            .attr('fill', d => color[d.label]);

        labelEnter
            .append('text')
            .classed('perc', true)
            .attr('x', (d, i) => {
                return 10;
            })
            .attr('y', (d, i) => {
                return 0.7 * bottomHeight;
            })

            .text(d => d.label)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.label);

        labelEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', (d, i) => {
                return 10;
            })
            .attr('y', (d, i) => {
                return 0.5 * bottomHeight;
            })

            .text(d => `${d.percentage}%`)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.percentage);
    }
}
