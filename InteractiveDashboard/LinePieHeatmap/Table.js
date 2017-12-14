/**
 * Created by bikramkawan on 12/13/17.
 */

const DATE_CONST = [
    {group: 'A', range: [5, 11], label: '5am - 11am', color: 'orange'},
    {group: 'B', range: [11, 17], label: '11am - 5pm', color: 'green'},
    {group: 'C', range: [17, 23], label: '5pm - 11pm', color: 'lightblue'},
    {group: 'D', range: [23, 5], label: '11pm - 5am', 'color': 'red'}
]

class Table {

    constructor(data) {
        this.data = formatTableData(data);

    }


    draw() {

        console.log(this.data)

        const tableRow = d3.select('.timeBody')
            .selectAll('div')
            .data(this.data)
            .enter()
            .append('div')
            .classed('row body', true)


        tableRow.append('div').classed('legendColor', true).style('background', d=>d.color)
        tableRow.append('div').text(d=>d.label).classed('hour', true)
        tableRow.append('div').text(d=>d.percents+' %').classed('per', true)
        tableRow.append('div').text(d=>d.count).classed('total', true)


    }


}


function formatTableData(rawdata) {
    const parseTime = d3.timeFormat('%H')
    const groupData = DATE_CONST.map((d)=> {
        const filtered = rawdata.filter(e=> parseFloat(parseTime(e.time)) >= d.range[0] && parseFloat(parseTime(e.time)) < d.range[1])
        return {...d, count: Math.floor(_.sumBy(filtered, 'count'))};
    })
    const totalSum = _.sumBy(groupData, 'count');
    return groupData.map(d=>({...d, percents: Math.floor(100 * d.count / totalSum)}))
}
