const svg = d3.select('svg'),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom;

const x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.tsv('lastMonth_btc.tsv', (error, rawdata) => {
    if (error) throw error;
    const data = rawdata.map(d => ({
        ...d,
        frequency: parseFloat(d.frequency),
    }));
    x.domain(data.map(d => d.letter));
    y.domain([0, d3.max(data, d => d.frequency)]);

    g
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g
        .append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');

    g
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.letter))
        .attr('y', d => y(d.frequency))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.frequency))
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(`Frequency: ${d.frequency} <br/> Letter : ${d.letter} `)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
});
