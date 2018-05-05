/**
 * Created by bikramkawan on 12/15/17.
 */
import * as d3 from 'd3'

import {colors,days,times} from "../utils/utils";

export default class HeatMap {
    constructor(param) {
        this.margin = param.margin;
        this.width = param.width - this.margin.left - this.margin.right;
        this.height = param.height - this.margin.top - this.margin.bottom;
        this.data = param.data;
        this.rawData = param.data;
        this.setScale();
    }

    /**/
    setScale() {
        this.gridSize = Math.floor(this.width / 24);
        this.legendElementWidth = this.gridSize * 2;
        const maxValue = d3.max(this.data, d => d.count);
        this.colorScale = d3
            .scaleQuantile()
            .domain([maxValue/3, maxValue/2, maxValue])
            .range(colors);
    }

    update(filtered) {
        if (filtered.length < 0) return;
        this.data = filtered;
        this.setScale();
        this.draw();
    }



    updateDimension(height, width) {
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.setScale();

        d3
            .select('.heatmap')
            .selectAll('svg')
            .remove();

        this.draw();
    }
    getData() {
        return this.rawData;
    }

    draw() {
        const that = this;
        d3
            .select('.heatmap')
            .select('svg')
            .remove();

        const svg = d3
            .select('.heatmap')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                `translate( ${this.margin.left},${this.margin.top})`,
            );

        svg
            .selectAll('.dayLabel')
            .data(days)
            .enter()
            .append('text')
            .text(d => d)
            .attr('x', 0)
            .attr('y', (d, i) => i * that.gridSize)
            .style('text-anchor', 'end')
            .attr('transform', `translate(-6,${that.gridSize / 1.5})`)
            .attr(
                'class',
                (d, i) =>
                    i >= 0 && i <= 4
                        ? 'dayLabel mono axis axis-workweek'
                        : 'dayLabel mono axis',
            );

        svg
            .selectAll('.timeLabel')
            .data(times)
            .enter()
            .append('text')
            .text(d => d)
            .attr('x', (d, i) => i * that.gridSize)
            .attr('y', 0)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + this.gridSize / 2 + ', -6)')
            .attr(
                'class',
                (d, i) =>
                    i >= 7 && i <= 16
                        ? 'timeLabel mono axis axis-worktime'
                        : 'timeLabel mono axis',
            );

        const rectangles = svg
            .selectAll('.hour')
            .data(this.data, d => d.day + ':' + d.hour);

        rectangles
            .enter()
            .append('rect')
            .attr('x', d => d.hour * that.gridSize)
            .attr('y', d => d.day * that.gridSize)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('class', 'hour bordered')
            .attr('width', this.gridSize)
            .attr('height', this.gridSize)
            .attr('fill', d => that.colorScale(d.count))
            .append('title')
            .text(d => Math.round(d.count));

        rectangles.exit().remove();

        const belowLegend = svg
            .selectAll('.legend')
            .data([0].concat(this.colorScale.quantiles()), d => d)
            .enter()
            .append('g')
            .attr('class', 'legend');

        belowLegend
            .append('rect')
            .attr('x', (d, i) => that.legendElementWidth * i)
            .attr('y', this.height)
            .attr('width', this.legendElementWidth)
            .attr('height', this.gridSize / 2)
            .style('fill', (d, i) => colors[i]);

        belowLegend
            .append('text')
            .attr('class', 'mono')
            .text(d => '≥ ' + Math.round(d))
            .attr('x', (d, i) => that.legendElementWidth * i)
            .attr('y', this.height + this.gridSize);

        belowLegend.exit().remove();
    }
}


