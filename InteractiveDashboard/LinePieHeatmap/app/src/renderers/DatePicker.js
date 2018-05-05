import moment from 'moment';
import $ from 'jquery';
import * as d3 from 'd3';
export default class DatePicker {
    constructor() {
        this.startDate = null;
        this.endDate = null;
    }
    appendDatePicker() {
        d3.select('.filterDate').on('click', () => this.updateApp());

        $('#datetimepicker1')
            .datetimepicker({
                sideBySide: true,
            })
            .on('dp.change', e => {
                this.startDate = moment(e.date).toDate();
            });

        $('#datetimepicker2')
            .datetimepicker({
                sideBySide: true,
            })
            .on('dp.change', e => {
                this.endDate = moment(e.date).toDate();
            });
    }

    updateApp() {

        console.log(this.startDate, 'dfasfafasfa',this.endDate);
    }
}
