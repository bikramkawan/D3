class MultipleHeatmap {
    constructor({ data, width, height }) {
        this.data = data;
        this.height = height;
        this.width = width;
    }

    draw() {
        this.width = this.width - 200;
        const topHeight = 0.8 * this.height;
        const bottomHeight = 0.2 * this.height;
        const someOffset = -30;
        const { data, itemScale, maxPercentage } = this.prepareData();
        const svg = d3
            .select('#combinedheatmap')
            .style('width', `${this.width}px`)
            .style('height', `${this.height}px`);

        data.forEach(single => {
            const itemSvg = svg.append('g').classed('col', true);
            this.mapSingleElement({ svg: itemSvg, data: single, itemScale });
        });

        const labelSvg = svg
            .append('g')
            .classed('label', true)
            .attr('transform', (d, i) => `translate(5,${0.75 * this.height})`);
        const labels = _.uniqBy(this.data, 'category').map(d => d.category);
        const filterByAndSum = labels.map(u => {
            const filtered = this.data.filter(d => d.category === u);
            const value = _.sumBy(filtered, 'value');
            const percentage = _.sumBy(filtered, 'percentage');
            const clicked = _.sumBy(filtered, 'clicked');

            return {
                label: u,
                value,
                percentage,
                clicked,
                color: filtered[0].color,
                shortName: filtered[0].shortName ? filtered[0].shortName : u,
            };
        });
        const binSize = this.width / filterByAndSum.length;
        console.error(filterByAndSum, 'sssssumsmulti');
        const labelHeight = 0.75 * this.height;
        const availableLabelHeight = this.height - labelHeight;

        const labelEnter = labelSvg
            .selectAll('g')
            .data(filterByAndSum)
            .enter()
            .append('g')
            .classed('category', true)
            .attr('transform', (d, i) => {
                return `translate(${binSize * i},${0})`;
            });

        labelEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', d => {
                return 0;
            })
            .attr('y', d => {
                console.error(d, 'datalabel');
                return availableLabelHeight / 2;
            })
            .text(d => {
                const shortName = d.shortName ? d.shortName : d.label;
                const value = Math.floor(d.value * 100);
                return `${value}% ${shortName}`;
            })
            .attr('fill', d => d.color)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => {
                const shortName = d.shortName ? d.shortName : d.label;
                const value = Math.floor(d.value * 100);
                return `${value}% ${shortName}`;
            });

        /*
        labelEnter
            .append('rect')
            .classed('top', true)
            .attr('width', (d, i) => binSize)
            .attr('height', bottomHeight)
            .attr('fill', d => d.color);

        labelEnter
            .append('foreignObject')
            .attr('width', (d, i) => binSize)
            .attr('height', bottomHeight)
            .append('xhtml:div')
            .attr(
                'title',
                d => `${d.label}(${Math.floor(d.percentage * 100)}%)`,
            )
            .classed('foreignObject', true)
            .html(
                d =>
                    `<div >${d.label}</div><div>${Math.floor(
                        d.percentage * 100,
                    )}%</div>`,
            );

         */
    }
    mapSingleElement({ svg, data, itemScale }) {
        const topHeight = 0.7 * this.height;
        const bottomHeight = 0.2 * this.height;
        const someOffset = -30;
        const gEnter = svg
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .classed('col', true)
            .attr('transform', (d, i) => {
                const previousArrayLength = Array.from(
                    { length: i },
                    (v, i) => i,
                );
                const width = _.sumBy(
                    previousArrayLength.map(e => itemScale(data[e].value)),
                );
                return `translate(${width},0)`;
            });

        gEnter
            .append('rect')
            .classed('top', true)
            .attr('width', d => {
                return itemScale(d.value);
            })
            .attr('height', topHeight)
            .attr('fill', d => d.color)
            .style('opacity', 0.2);
        gEnter
            .append('path')
            .attr('d', d => {
                if (d.hasPercentageLine) {
                    const availableWidth = itemScale(d.value);
                    return `M${availableWidth *
                        d.percentage},0 L${availableWidth *
                        d.percentage},${topHeight}`;
                }
            })
            .attr('stroke', 'red')
            .attr('fill', 'none');

        gEnter
            .append('rect')
            .classed('inset', true)
            .attr('width', d => itemScale(d.value) * d.clicked)
            .attr('height', d => topHeight * d.clicked)
            .attr('x', d => {
                const binWidth = itemScale(d.value) * d.clicked;
                return itemScale(d.value) - binWidth;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.clicked;
                return topHeight - binHeight;
            })
            .attr('fill', '#1aa4cd')
            .style('opacity', 0.2)
            .append('title')
            .text(d => `${Math.floor(d.clicked) * 100}%`)
            .style('opacity', 0.2);
        //

        gEnter
            .append('text')
            .classed('multiHeatmapText', true)
            // .attr('width', d => itemScale(d.value.value) * d.value.clicked)
            // .attr('height', d => topHeight * d.value.clicked)
            .attr('x', d => {
                const binWidth = itemScale(d.value) * d.clicked;
                return 5 + itemScale(d.value) - binWidth;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.clicked;
                return topHeight - binHeight / 2;
            })
            // .append('xhtml:div')
            // .attr('title', d => `${d.value.clicked}%`)
            // .classed('foreignObject', true)
            .text(d => `${Math.floor(d.clicked) * 100}%`);

        // gEnter
        //     .append('foreignObject')
        //     .attr('width', d => itemScale(d.value) * d.clicked)
        //     .attr('height', d => topHeight * d.clicked)
        //     .attr('x', d => {
        //         const binWidth = itemScale(d.value) * d.clicked;
        //         return itemScale(d.value) - binWidth;
        //     })
        //     .attr('y', d => {
        //         const binHeight = topHeight * d.clicked;
        //         return topHeight - binHeight;
        //     })
        //     .append('xhtml:div')
        //     .attr('title', d => `${Math.floor(d.clicked)}%`)
        //     .classed('foreignObject', true)
        //     .text(d => `${Math.floor(d.clicked)}%`)
        //     .style('opacity', 0.2);
    }

    prepareData() {
        const groupByHeatmap = _.groupBy(this.data, d => d.id);
        let data = Object.keys(groupByHeatmap).map(d => groupByHeatmap[d]);
        const maxPercentage = 1;
        const itemScale = d3.scale
            .linear()
            .domain([0, maxPercentage])
            .range([0, this.width]);
        this.itemScale = itemScale;
        return { data, itemScale, maxPercentage };
    }
}
