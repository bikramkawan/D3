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
