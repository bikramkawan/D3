/**
 * Created by bikramkawan on 12/18/17.
 */
import {parseWeek} from "../utils/utils";

export default class TopScore {
    constructor(param) {
        this.data = param.data;
        this.selector = param.selector;
    }

    updateScores() {
        const todayDate = new Date();
        const thisWeek = parseWeek(todayDate) - 1;
        const thisMonth = todayDate.getMonth();
        const thisYear = todayDate.getFullYear();
        const thisYearData = this.data.filter(d => d.year === thisYear);
        const thisMonthData = thisYearData.filter(d => d.month === thisMonth);
        const thisWeekData = thisYearData.filter(d => d.week === thisWeek);
        const allTimeCount = Math.round(_.sumBy(this.data, 'count'));
        const yearCount = Math.round(_.sumBy(thisYearData, 'count'));
        const monthCount = Math.round(_.sumBy(thisMonthData, 'count'));
        const weekCount = Math.round(_.sumBy(thisWeekData, 'count'));

        const mapData = [
            {
                label: 'This Week',
                id: 'week',
                value: weekCount,
            },
            {
                label: 'This Month',
                id: 'month',
                value: monthCount,
            },
            {
                label: 'This Year',
                id: 'year',
                value: yearCount,
            },
            {
                label: 'All Time',
                id: 'allTime',
                value: allTimeCount,
            },
        ];

        const box = d3
            .select(`.${this.selector}`)
            .selectAll('div')
            .data(mapData)
            .enter()
            .append('div')
            .classed('innerbox', true);

        box
            .append('div')
            .classed('name', true)
            .text(d => d.label);
        box
            .append('div')
            .classed('value', true)
            .text(d => d.value);
    }
}
