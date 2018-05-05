import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';
export const DATE_CONST = [
    { group: 'A', range: [5, 11], label: '5am - 11am', color: 'orange' },
    { group: 'B', range: [11, 17], label: '11am - 5pm', color: 'green' },
    { group: 'C', range: [17, 23], label: '5pm - 11pm', color: 'lightblue' },
    { group: 'D', range: [23, 5], label: '11pm - 5am', color: 'red' },
];

export function formatTableData(rawdata) {
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

//https://gist.github.com/IamSilviu/5899269
export function parseWeek(date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

export const colors = ['blue', 'green', 'yellow', 'red']; // alternatively colorbrewer.YlGnBu[9]

export const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const times = [
    '1a',
    '2a',
    '3a',
    '4a',
    '5a',
    '6a',
    '7a',
    '8a',
    '9a',
    '10a',
    '11a',
    '12a',
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '10p',
    '11p',
    '12p',
];

export function formatInitialData(rawData) {
    const dateFormat = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    return rawData.message.results.map(d => ({
        time: dateFormat(d.time.split('.')[0]),
        count: d.count,
    }));
}

export function formatRawData(data) {
    const daysIndex = days.map((d, i) => i);
    const timeIndex = times.map((d, i) => i);
    const dataByWeek = daysIndex
        .map(d => _.groupBy(data, e => e.time.getDay() === d).true)
        .filter(d => d !== undefined);

    return dataByWeek
        .map((d, i) => {
            return timeIndex
                .map(e => {
                    let groupedBy = _.groupBy(d, f => f.time.getHours() === e)
                        .true;
                    return groupedBy
                        ? groupedBy.map((g, f) => ({
                              ...g,
                              day: i,
                              hour: groupedBy[0].time.getHours(),
                              month: g.time.getMonth(),
                              week: parseWeek(g.time) - 1,
                              year: g.time.getFullYear(),
                          }))
                        : [];
                })
                .reduce((acc, cur) => acc.concat(cur), []);
        })
        .reduce((acc, cur) => acc.concat(cur), []);
}
