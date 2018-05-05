import {DATE_CONST} from "../utils/utils";
import * as d3 from 'd3'

export  default class Table {
    constructor(param) {
        this.data = formatTableData(param.data);
        this.selector = param.selector;
    }

    update(filtered) {
        if (filtered.length < 0) return;
        this.data = formatTableData(filtered);
        this.draw();
    }

    draw() {
        d3
            .select(`.${this.selector}`)
            .selectAll('div')
            .remove();

        const tableRow = d3
            .select(`.${this.selector}`)
            .selectAll('div')
            .data(this.data)
            .enter()
            .append('div')
            .classed('row body', true);

        tableRow
            .append('div')
            .classed('legendColor', true)
            .style('background', d => d.color);
        tableRow
            .append('div')
            .text(d => d.label)
            .classed('hour', true)
            .attr('title', d => d.label);

        tableRow
            .append('div')
            .text(d => d.percents + ' %')
            .attr('title', d => d.percents + ' %')
            .classed('per', true);
        tableRow
            .append('div')
            .text(d => d.count)
            .attr('title', d => d.count)
            .classed('total', true);
    }
}

function formatTableData(rawdata) {
    const parseTime = d3.timeFormat('%H');
    const groupData = DATE_CONST.map(d => {
        const filtered = rawdata.filter(e => {
            if (d.range[1] !== 5) {
                return e.hour >= d.range[0] && e.hour < d.range[1];
            } else {
                return e.hour >= d.range[0] || e.hour < d.range[1];
            }
        });
        return { ...d, count: Math.floor(_.sumBy(filtered, 'count')) };
    });
    const totalSum = _.sumBy(groupData, 'count');
    return groupData.map(d => ({
        ...d,
        percents: Math.floor(100 * d.count / totalSum),
    }));
}
