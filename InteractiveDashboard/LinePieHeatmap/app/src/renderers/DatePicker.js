import moment from 'moment';
import $ from 'jquery';
import * as d3 from 'd3';
import { formatInitialData, formatRawData } from '../utils/utils';
export default class DatePicker {
    constructor(props) {
        this.startDate = null;
        this.endDate = null;
        this.props = props;
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
        console.log(this.startDate, 'dfasfafasfa', this.endDate);
        if (!this.startDate && !this.endDate) return;
        const {
            heatMap,
            tablePies,
            lineChart,
            barChart,
            pieCharts,
        } = this.props;

        const dataPost = JSON.stringify({
            id: 'testunit',
            namespace: '/readerWifiCount',
            message: {
                beaconReaderId:
                    'device-id-8f373a31-a510-4a3f-9472-4a0f5bb56245',
                startDateTime: this.startDate,
                endDateTime: this.endDate,
                timeInterval: '60',
            },
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                const responseData = JSON.parse(this.responseText);
                const formatResponse = formatInitialData(responseData);
                const renderFormat = formatRawData(formatResponse);
                if (renderFormat.length > 0) {
                    heatMap.update(renderFormat);
                    lineChart.update(formatResponse);
                    barChart.update(renderFormat);
                    tablePies.forEach(t => t.update(renderFormat));
                    pieCharts.forEach(p => p.update(renderFormat));
                } else {
                    alert('No Data Found in this Range');
                }
            }
        });

        xhr.open('POST', 'https://ebs-granite.bigbang.io/api/v1/call');
        xhr.setRequestHeader(
            'authorization',
            'Bearer at_1fbc4851-8c41-4c27-80a3-d0a884f9f684',
        );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader(
            'Postman-Token',
            '8d7989e0-b3de-8adb-7a3f-495cdb7605fb',
        );

        xhr.send(dataPost);
    }




}
