/**
 * Created by bikramkawan on 10/27/17.
 */



define(function () {

    return {

        constants: function () {

            const margin = {top: 70, right: 200, bottom: 50, left: 100, topX: 30},
                width = 1100 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                brushMargins = {
                    bottomX: {x: margin.left, y: height + margin.top + 30},
                    topX: {x: margin.left, y: 0},
                    y1: {x: margin.left / 2, y: margin.top},
                    y2: {x: width + margin.right / 2 + 70, y: 70},
                    y3: {x: width + margin.right + 50, y: 70}
                }

            return {margin, width, height,brushMargins};

        },

        main: function () {

            const {margin, width, height,brushMargins} = this.constants();

            const parseDate = d3.timeParse("%m/%d/%y %H:%M:%S");
            const x = d3.scaleTime().range([0, width]),
                y1 = d3.scaleLinear().range([height, 0]),
                y2 = d3.scaleLinear().range([height, 0]),
                y3 = d3.scaleLinear().range([height, 0]),
                x2 = d3.scaleLinear().range([0, width]);
            const legends = [{

                name: 'Line Press #1',
                className: 'lineY11',
                scale: y1,
                unit: 'Psi'
            },
                {

                    name: 'Line Press #2',
                    className: 'lineY12',
                    scale: y1,
                    unit: 'Psi'


                },
                {

                    name: 'Tubing Press',
                    className: 'lineY13',
                    scale: y1,
                    unit: 'Psi'


                }, {

                    name: 'Discharge Rate',
                    className: 'lineY21',
                    scale: y2,
                    unit: 'bbl/min'


                }, {

                    name: 'Tubing Rate',
                    className: 'lineY22',
                    scale: y2,
                    unit: 'bbl/min'


                }, {

                    name: 'Proppant Conc 40/70',
                    className: 'lineY31',
                    scale: y3,
                    unit: 'ppa'


                }


            ]

            return {
                margin, width, height, parseDate, legends,brushMargins,
                x, y1, y2, y3, x2
            }
        },
        formatData: function (rawdata) {

            const data = [];

            const {parseDate} = this.main();
            rawdata.forEach((item)=> {
                data.push({
                    date: parseDate(`${item.date} ${item.time}`),
                    time2: parseFloat(item.time2),
                    y11: parseFloat(item.y1_lp1) < 0 ? 0 : parseFloat(item.y1_lp1),
                    y12: parseFloat(item.y1_lp2) < 0 ? 0 : parseFloat(item.y1_lp2),
                    y13: parseFloat(item.y1_tp) < 0 ? 0 : parseFloat(item.y1_tp),
                    y21: parseFloat(item.y2_dr) < 0 ? 0 : parseFloat(item.y2_dr),
                    y22: parseFloat(item.y2_tr) < 0 ? 0 : parseFloat(item.y2_tr),
                    y31: parseFloat(item.y3_pc) < 0 ? 0 : parseFloat(item.y3_pc)
                })

            })

            return data;


        },
        formatLineData: function (config) {

            const {
                data,
                xAxis1,
                xAxis2,
                x,
                x2,
                y1,
                y2,
                y3,
                svg,
                width,
                lineY11,
                lineY12,
                lineY13,
                lineY21,
                lineY22,
                lineY31,
                yAxis1,
                yAxis2,
                yAxis3,
            } = config;

            const line1 = {
                linedata: data,
                linefunc: lineY11,
                lineclass: 'lineY11',
                lineYAxis: yAxis1,
                yAxisOffset: 0,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'Yleft',
                allData: data,

            }

            const line2 = {
                linedata: data,
                linefunc: lineY12,
                lineclass: 'lineY12',
                lineYAxis: yAxis1,
                yAxisOffset: 0,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'Yleft',
                allData: data,

            }
            const line3 = {
                linedata: data,
                linefunc: lineY13,
                lineclass: 'lineY13',
                lineYAxis: yAxis1,
                yAxisOffset: 0,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'Yleft',
                allData: data,

            }

            const line4 = {
                linedata: data,
                linefunc: lineY21,
                lineclass: 'lineY21',
                lineYAxis: yAxis2,
                yAxisOffset: width + 30,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'YRight1',
                allData: data,

            }

            const line5 = {
                linedata: data,
                linefunc: lineY22,
                lineclass: 'lineY22',
                lineYAxis: yAxis2,
                yAxisOffset: width + 90,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'YRight1',
                allData: data,

            }
            const line6 = {
                linedata: data,
                linefunc: lineY31,
                lineclass: 'lineY31',
                lineYAxis: yAxis3,
                yAxisOffset: width + 110,
                xAxis1,
                xAxis2,
                x,
                svg,
                yAxixClass: 'YRight2',
                allData: data,

            }


            return [line1, line2, line3, line4, line5, line6]

        },
        formatBrushData: function (param) {
            const {x, margin, x2, brushDimension, y1, y2, y3, lineData} = param;

            const brush1 = {
                selector: 'TopX1',
                scale: x,
                brushDimension,
                orientation: 'horizontal',
                margin,
                key: 'date',
                lineData
            }

            const brush2 = {
                selector: 'BottomX1',
                scale: x2,
                brushDimension,
                orientation: 'horizontal',
                margin,
                key: 'time2',
                lineData
            }

            const brush3 = {
                selector: 'Yleft',
                scale: y1,
                brushDimension,
                orientation: 'vertical',
                margin,
                key: 'y1',
                lineData
            }

            const brush4 = {
                selector: 'YRight1',
                scale: y2,
                brushDimension,
                orientation: 'vertical',
                margin,
                key: 'y2',
                lineData
            }
            const brush5 = {
                selector: 'YRight2',
                scale: y3,
                brushDimension,
                orientation: 'vertical',
                margin,
                key: 'y31',
                lineData
            }


            return [brush2];

        },
        formatBrushAxisData: function (param) {

           console.log(param)
            const {
                brushMargins,
                xAxis1,
                xAxis2,
                yAxis1,
                yAxis2,
                yAxis3,
            } = param;
            const brush1 = {

                selector: 'brush1',
                margin: brushMargins.topX,
                axis: xAxis1
            }

            const brush2 = {

                selector: 'brush2',
                margin: brushMargins.bottomX,
                axis: xAxis2
            }
            const brush3 = {

                selector: 'brush3',
                margin: brushMargins.y1,
                axis: yAxis1
            }
            const brush4 = {

                selector: 'brush4',
                margin: brushMargins.y2,
                axis: yAxis2
            }
            const brush5 = {

                selector: 'brush5',
                margin: brushMargins.y3,
                axis: yAxis3
            }


            return [brush1, brush2, brush3, brush4, brush5]

        }

    }

})