(function() {
    const marketDataGeneratorForm = $('#market-data-generator');
    marketDataGeneratorForm.submit(ev => {
        const probabilityField = $('#probability')[0];
        const pricesSetField = $('#prices-set')[0];
        let probability = probabilityField.value;
        let pricesSet = pricesSetField.value.split(',');
        if (isNaN(+probability) || probability < 0.5 || probability > 1.0) {
            return alert(
                "Probability' isn't between 0.50 < Probability <= 1.0",
            );
        }
        let hasWrongPrice = false;
        pricesSet.find(price => {
            return isNaN(+price);
        });
        if (hasWrongPrice || !pricesSetField.value) {
            return alert('Please enter correct price set');
        }

        //Under 'Probability', put 0.9 in the field
        // For 'Prices Set', enter 5,10,0,20
        window.market_data = create_d3_data(probability, pricesSet);
        window.market_data.then(data => {
            console.log(data);
            const margin = { top: 20, right: 20, bottom: 30, left: 50 },
                width = 600 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            const x = d3.scaleLinear().range([0, width]);
            const y = d3.scaleLinear().range([height, 0]);

            const line = d3
                .line()
                .x(d => x(d.time))
                .y(d => y(d.price));

            d3
                .select('.linechart')
                .selectAll('svg')
                .remove();
            const svg = d3
                .select('.linechart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')',
                );

            x.domain(d3.extent(data, d => d.time));
            y.domain([0, d3.max(data, d => d.price)]);

            svg
                .append('path')
                .data([data])
                .attr('class', 'line')
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue');

            svg
                .append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x))
                .append('text')
                .attr('fill', '#000')
                .attr('y', 20)
                .attr('x', width / 2)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'middle')
                .text('Time')
                .style('font-size', '12px');

            svg
                .append('g')
                .call(d3.axisLeft(y))
                .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'middle')
                .text('Price')
                .style('font-size', '12px');
        });

        // console.log(window.price_time_data);
    });
})();
