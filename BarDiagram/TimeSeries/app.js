const margin = { top: 30, right: 20, bottom: 70, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

d3.json('data.json').then(function(rawdata) {
    console.log(rawdata);
    const previousProps = {
        margin,
        data: rawdata.previous,
        width,
        height,
        color: 'steelblue',
        selector: '.previous',
        barClass: 'previous-bar',
        widthOffSet: 110,
        foreignHeight: 30,
        foreignWidth: 150,
    };
    const recentProps = {
        margin,
        data: rawdata.recent,
        width,
        height,
        color: 'steelblue',
        selector: '.recent',
        barClass: 'recent-bar',
        widthOffSet: 110,
        foreignHeight: 30,
        foreignWidth: 150,
    };
    const previousBar = new BarDiagram(previousProps);
    previousBar.draw();

    const recentBar = new BarDiagram(recentProps);
    recentBar.draw();

    const previousDispatchEvt = d3.dispatch('focus', 'blur');
    const recentDispatchEvt = d3.dispatch('focus', 'blur');

    const previousToolTip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const recentToolTip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    d3
        .selectAll('.previous-bar')
        .on('mouseover', function(data, index) {
            d3.select(this).classed('focus', true);
            previousToolTip.style('opacity', 1);
            previousToolTip
                .text(`${data[0]}, ${data[1]}`)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px');

            return recentDispatchEvt.focus(data, index);
        })
        .on('mouseleave', function(data, index) {
            d3.select(this).classed('focus', false);
            previousToolTip.style('opacity', 0);
            return recentDispatchEvt.blur(data, index);
        });

    d3
        .selectAll('.recent-bar')
        .on('mouseover', function(data, index) {
            d3.select(this).classed('focus', true);
            recentToolTip.style('opacity', 1);
            recentToolTip
                .text(`${data[0]}, ${data[1]}`)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
            return previousDispatchEvt.focus(data, index);
        })
        .on('mouseleave', function(d, index) {
            d3.select(this).classed('focus', false);
            recentToolTip.style('opacity', 0);
            return previousDispatchEvt.blur(d, index);
        });

    previousDispatchEvt.focus = function(data, index) {
        d3.selectAll(`[data-attr="${index}"]`).classed('focus', true);
        d3
            .selectAll(`[tool-attr-previous-bar="${index}"]`)
            .classed('visible', true);
    };
    previousDispatchEvt.blur = function(data, index) {
        d3.selectAll(`[data-attr="${index}"]`).classed('focus', false);
        d3
            .selectAll(`[tool-attr-previous-bar="${index}"]`)
            .classed('visible', false);
    };

    recentDispatchEvt.focus = function(data, index) {
        d3.selectAll(`[data-attr="${index}"]`).classed('focus', true);

        d3
            .selectAll(`[tool-attr-recent-bar="${index}"]`)
            .classed('visible', true);
    };
    recentDispatchEvt.blur = function(data, index) {
        d3.selectAll(`[data-attr="${index}"]`).classed('focus', false);

        d3
            .selectAll(`[tool-attr-recent-bar="${index}"]`)
            .classed('visible', false);
    };
});
