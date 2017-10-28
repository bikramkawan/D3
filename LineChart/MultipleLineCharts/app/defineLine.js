/**
 * Created by bikramkawan on 10/27/17.
 */
define(function () {

    return {

        defineLine: function (x,y1,y2,y3) {

            const lineY11 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=>y1(d.y11));


            const lineY12 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=> y1(d.y12));

            const lineY13 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=> y1(d.y13));

            const lineY21 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=>y2(d.y21));


            const lineY22 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=>y2(d.y22));


            const lineY31 = d3.line()
                .x((d)=> x(d.date))
                .y((d)=>y3(d.y31));


            return {lineY11, lineY12, lineY13, lineY21, lineY22, lineY31}

        }

    }


})