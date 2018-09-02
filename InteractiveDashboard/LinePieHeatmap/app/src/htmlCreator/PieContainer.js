import * as d3 from 'd3';

class PieContainer {
    constructor(props) {
        this.props = props;
    }

    draw() {
        const select = d3.select('.chartContainer').select('.left');
        console.log(this.props.length, select);

        const rows = Math.round(this.props.length / 4);
        const array = Array.from({ length: rows }, (v, i) => i);
        console.log(array, rows);

        array.forEach((d, i) => {
            const childRow = select.append('div').classed('childRow', true);
            const index = 4 * i + 1;
            const col1 = childRow.append('div').classed('childCol', true);
            this.createContainer(col1, index);
            const col2 = childRow.append('div').classed('childCol', true);
            this.createContainer(col2, index + 1);
            const col3 = childRow.append('div').classed('childCol', true);
            this.createContainer(col3, index + 2);
            const col4 = childRow.append('div').classed('childCol', true);
            this.createContainer(col4, index + 3);
        });
    }

    createContainer(selector, index) {
        selector.append('div').classed(`dataSource source${index}`, true);
        selector.append('div').classed(`pie pie${index}`, true);
        const time = selector.append('div').classed('time', true);
        const rowHeader = time.append('div').classed('row header', true);
        rowHeader.append('div').classed('transparent', true);
        rowHeader.append('div').text('Hours');
        rowHeader.append('div').text(' %');
        rowHeader.append('div').text(' Total');
        time.append('div').classed(`timeBody timeBody${index}`, true);
    }
}

export default PieContainer;
