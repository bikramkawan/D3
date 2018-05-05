import * as d3 from 'd3';

export default class SvgGenerator {
    constructor() {
        this.makeSvg();
    }

    makeSvg() {
        this.lineEl = document.querySelector('.line');
        this.lineWidth = this.lineEl.clientWidth;
        this.lineHeight = this.lineEl.clientHeight;

        this.heatEl = document.querySelector('.heatmap');
        this.heatWidth = this.heatEl.clientWidth;
        this.heatHeight = this.heatEl.clientHeight;

        this.pieEl = document.querySelector('.pie');
        this.pieElWidth = this.pieEl.clientWidth;
        this.pieElHeight = this.pieEl.clientHeight;

        this.barEl = document.querySelector('.bar');
        this.barWidth = this.lineEl.clientWidth;
        this.barHeight = this.lineEl.clientHeight;

        this.lineSVG = d3
            .select('.line')
            .append('svg')
            .attr('width', this.lineWidth)
            .attr('height', this.lineHeight);
        this.barSVG = d3
            .select('.bar')
            .append('svg')
            .attr('width', this.lineWidth)
            .attr('height', this.lineHeight);
        this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
        this.heatMapMargin = { top: 50, right: 0, bottom: 100, left: 30 };
        this.width = this.lineWidth - this.margin.left - this.margin.right;
        this.height = this.lineHeight - this.margin.top - this.margin.bottom;
    }

    getDimension() {
        return {
            width: this.width,
            height: this.height,
            lineWidth: this.lineWidth,
            lineHeight: this.lineHeight,
            heatWidth: this.heatWidth,
            heatHeight: this.heatHeight,
            pieElHeight: this.pieElHeight,
            pieElWidth: this.pieElWidth,
            barWidth: this.barWidth,
            barHeight: this.barHeight,
            margin: this.margin,
            heatMapMargin: this.heatMapMargin,
        };
    }

    getSvg() {
        return { lineSVG: this.lineSVG, barSVG: this.barSVG };
    }
}
