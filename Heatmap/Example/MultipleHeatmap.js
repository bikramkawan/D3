class MultipleHeatmap {
    constructor({
        data,
        width,
        height,
        clickedWidth,
        clickedColor,
        opt,
        totalClickedRate,
    }) {
        this.data = data;
        this.height = height;
        this.width = width;
        this.clickColor = opt.clickColor;
        this.clickedWidth = clickedWidth;
        this.clickedColor = clickedColor;
        this.totalClickedRate = totalClickedRate;
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

        const clickedArea = svg.append('g').classed('clickedArea', true);
        clickedArea
            .append('rect')
            .classed('clickedArea', true)
            .attr('x', this.width * (1 - this.clickedWidth))
            .attr('width', this.width * this.clickedWidth)
            .attr('height', 0.7 * this.height)
            .attr('fill', this.clickedColor);

        data.forEach(single => {
            const itemSvg = svg.append('g').classed('col', true);
            this.mapSingleElement({ svg: itemSvg, data: single, itemScale });
        });

        const collectReadPercentageItems = this.data.filter(
            d => d.hasPercentageLine,
        );
        const readPercentAverage =
            _.sumBy(collectReadPercentageItems, 'percentage') /
            collectReadPercentageItems.length;

        const labelHeight = 0.75 * this.height;
        const availableLabelHeight = this.height - labelHeight;
        svg
            .append('path')
            .attr('d', () => {
                const availableWidth = this.width * (1 - this.clickedWidth);
                return `M${availableWidth *
                    readPercentAverage},0 L${availableWidth *
                    readPercentAverage},${0.7 * this.height}`;
            })
            .attr('stroke', 'red')
            .attr('fill', 'none');

        const labelSvg = svg
            .append('g')
            .classed('label', true)
            .attr('transform', (d, i) => `translate(0,${0.75 * this.height})`);

        const totalClickedBar = labelSvg
            .append('rect')
            .classed('totalClickedBar', true)
            .attr('x', this.width * (1 - this.clickedWidth))
            .attr('height', '30')
            .attr('width', (d, i) => {
                return this.width * this.clickedWidth;
            })
            .attr('fill', this.clickedColor);

        labelSvg
            .append('text')
            .classed('labelTotalClickedRate', true)
            .attr('fill', this.clickedColor)
            .text(d => `${this.totalClickedRate.toFixed(2) * 100}% Total CR`)
            .attr('x', d => {
                return 5 + this.width * (1 - this.clickedWidth);
            })
            .attr('y', d => {
                return 10 + availableLabelHeight / 2;
            });

        const labels = _.uniqBy(this.data, 'category').map(d => d.category);
        const totalValue = _.sumBy(this.data, 'value');
        const totalPercentage = _.sumBy(this.data, 'percentage');
        const totalClicked = _.sumBy(this.data, 'clicked');

        const filterByAndSum = labels
            .map(u => {
                const filtered = this.data.filter(d => d.category === u);
                const value = _.sumBy(filtered, 'value') / totalValue;
                const percentage =
                    _.sumBy(filtered, 'percentage') / totalPercentage;
                const clicked = _.sumBy(filtered, 'clicked') / totalClicked;

                return {
                    label: u,
                    value,
                    percentage,
                    clicked,
                    color: filtered[0].color,
                    shortName: filtered[0].shortName
                        ? filtered[0].shortName
                        : u,
                };
            })
            .filter(l => l.value > 0);

        let total = 0;
        let click = 0;
        for (let i = 0; i < filterByAndSum.length; i++) {
            total += filterByAndSum[i].value;
            click += filterByAndSum[i].clicked;
        }
        total = total + click;
        const obj = { label: 'clicked', value: click, color: this.clickColor };
        filterByAndSum.push(obj);
        const binSize =
            this.width * (1 - this.clickedWidth) / filterByAndSum.length;

        const offset = 2;
        const widthScale = d3.scale
            .linear()
            .domain([0, total])
            .range([0, this.width * (1 - this.clickedWidth)]);

        const labelEnter = labelSvg
            .selectAll('g')
            .data(filterByAndSum)
            .enter()
            .append('g')
            .classed('category', true)
            .attr('transform', (d, i) => {
                return `translate(${binSize * i},${10})`;
            });
        let x_temp = 0;
        const rectEnter = labelSvg
            .selectAll('.category-rect')
            .data(filterByAndSum)
            .enter()
            .append('g')
            .classed('category-rect', true)
            .attr('transform', (d, i) => {
                x_temp =
                    i === 0 ? x_temp : x_temp + filterByAndSum[i - 1].value;
                return `translate(${widthScale(x_temp)},${0})`;
            });

        rectEnter
            .append('rect')
            .attr('height', '30')
            .attr('width', function(d, i) {
                return widthScale(d.value) - offset;
            })
            .attr('fill', d => d.color);

        labelEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', d => {
                return 0;
            })
            .attr('y', d => {
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
            .attr('x', d => {
                const binWidth = itemScale(d.value) * d.clicked;
                return 5 + itemScale(d.value) - binWidth;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.clicked;
                return topHeight - binHeight / 2;
            })

            .text(d => `${Math.floor(d.clicked) * 100}%`);
    }

    prepareData() {
        const groupByHeatmap = _.groupBy(this.data, d => d.id);
        let data = Object.keys(groupByHeatmap).map(d => groupByHeatmap[d]);
        const maxPercentage = 1;
        const itemScale = d3.scale
            .linear()
            .domain([0, maxPercentage])
            .range([0, this.width * (1 - this.clickedWidth)]);
        this.itemScale = itemScale;
        return { data, itemScale, maxPercentage };
    }
}
