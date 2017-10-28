/**
 * Created by bikramkawan on 10/27/17.
 */



define(function () {

    return {

        constants: function () {

            const margin = {top: 50, right: 200, bottom: 50, left: 50},
                width = 1100 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;

            return {margin, width, height};

        },

        main: function () {

            const {margin, width, height} = this.constants();

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
                margin, width, height, parseDate, legends,
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


        }

    }

})