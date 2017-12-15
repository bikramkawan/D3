class PieChart {
    constructor(param) {
        this.data = formatTableData(param.data);
        this.svg = param.pieSVG;
        this.margin = param.margin;
        this.width = param.width;
        this.height = param.height;
    }

    draw() {
        console.log(this.data, 'data');
        const g = this.svg
            .append('g')

        const radius = Math.min(this.width, this.height) / 2;
        const color = d3.scaleOrdinal([
            '#98abc5',
            '#8a89a6',
            '#7b6888',
            '#6b486b',
            '#a05d56',
            '#d0743c',
            '#ff8c00',
        ]);

        const pie = d3
            .pie()
            .sort(null)
            .value(function(d) {
                return d.count;
            });

        const path = d3
            .arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const label = d3
            .arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 10);

        const arc = g
            .selectAll('.arc')
            .data(pie(this.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arc
            .append('path')
            .attr('d', path)
            .attr('fill', function(d) {
                return color(d.data.group);
            });

        arc
            .append('text')
            .attr('transform', function(d) {
                return 'translate(' + label.centroid(d) + ')';
            })
            .attr('dy', '0.35em')
            .text(function(d) {
                return d.data.group;
            });
    }
}
