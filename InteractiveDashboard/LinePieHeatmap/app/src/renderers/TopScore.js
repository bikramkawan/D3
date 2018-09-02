/**
 * Created by bikramkawan on 12/18/17.
 */
import { parseWeek } from '../utils/utils';
import * as d3 from 'd3';
import _ from 'lodash';
export default class TopScore {
    constructor(param) {
        this.data = param.data;
        this.selector = param.selector;
    }

    calculateScore(data) {
        const todayDate = new Date();
        const thisWeek = parseWeek(todayDate) - 1;
        const thisMonth = todayDate.getMonth();
        const thisYear = todayDate.getFullYear();
        const thisYearData = data.filter(d => d.year === thisYear);
        const thisMonthData = thisYearData.filter(d => d.month === thisMonth);
        const thisWeekData = thisYearData.filter(d => d.week === thisWeek);
        const allTimeCount = Math.round(_.sumBy(data, 'count'));
        const yearCount = Math.round(_.sumBy(thisYearData, 'count'));
        const monthCount = Math.round(_.sumBy(thisMonthData, 'count'));
        const weekCount = Math.round(_.sumBy(thisWeekData, 'count'));

        return { allTimeCount, yearCount, monthCount, weekCount };
    }

    updateScores() {
        const getFormattedData = this.data.map(d => this.calculateScore(d));
        const mapData = [
            {
                label: 'This Week',
                id: 'week',
                value: getFormattedData.map((d, i) => ({
                    label: `Source${i}`,
                    value: d.weekCount,
                })),
            },
            {
                label: 'This Month',
                id: 'month',
                value: getFormattedData.map((d, i) => ({
                    label: `Source${i}`,
                    value: d.monthCount,
                })),
            },
            {
                label: 'This Year',
                id: 'year',
                value: getFormattedData.map((d, i) => ({
                    label: `Source${i}`,
                    value: d.yearCount,
                })),
            },
            {
                label: 'All Time',
                id: 'allTime',
                value: getFormattedData.map((d, i) => ({
                    label: `Source${i}`,
                    value: d.allTimeCount,
                })),
            },
        ];

        d3.select('.infoPanel').style('height',`${(getFormattedData.length*25) +50}`)

        const box = d3
            .select('.score')
            .selectAll('div')
            .data(mapData)
            .enter()
            .append('div')
            .classed('innerbox', true);

        box
            .append('div')
            .classed('name', true)
            .text(d => d.label);
        const dataSources = box.append('div').classed('dataSources', true);

        dataSources
            .selectAll('div')
            .data(d => d.value)
            .enter()
            .append('div')
            .text((d,i)=>`Source ${i}: ${d.value}`)
            .classed('dataSourceRow',true)
    }
}
