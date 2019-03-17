d3.csv('solar-data.csv').then(res => {
    console.error(res, 'response');
    const parsedData = res.map(r => {
        return {
            sex: r['What is your gender'],
            age: Number(r['What is your age?']),
            salaryWeekly:
                r[
                    'Please estimate your WEEKLY HOUSEHOLD income below. We are interested in your GROSS INCOME, which is your income before tax and other deductions, and an estimate for the whole of your household.'
                ],
            salaryAnnual:
                r[
                    'Please estimate your ANNUAL HOUSEHOLD income below. We are interested in your GROSS INCOME, which is your income before tax and other deductions, and an estimate for the whole of your household.'
                ],
            hasHome: r['Do you own, or are you renting your home?'],
            hasSolarPV:
                r['Do you have a solar PV system installed at your property?'],
            hasBatteryInstalled:
                r['Do you have a home battery installed at your property?'],
            expectedPayback:
                r[
                    'What would the payback period (the number of years before you recoup the money you spent on the battery) have to be for you to consider buying a home battery?'
                ],
            trustWorthiness:
                r[
                    'How trustworthy would you consider these information providers?'
                ]
        };
    });
    console.error(parsedData, 'parsed');

    function countUniqBy(fieldName) {
        const uniques = _.uniqBy(parsedData, fieldName).map(s => s[fieldName]);
        const countUniques = _.pick(_.countBy(parsedData, fieldName), uniques);
        const keys = Object.keys(countUniques);

        const result = keys.map(k => {
            let key = '';

            return {
                key: k ? k : 'Not Available',
                count: countUniques[k]
            };
        });
        return result;
    }

    const genderData = countUniqBy('sex');
    const hasHomeData = countUniqBy('hasHome');
    const trustWorthinessData = countUniqBy('trustWorthiness');
    const age = countUniqBy('age');
    const ageGroup = [
        {
            group: 0,
            comparator: 'equal',
            label: 'Not Available'
        },
        {
            group: [1, 19],
            label: 'Teens'
        },
        {
            group: [20, 29],
            label: '20s'
        },
        {
            group: [30, 39],
            label: '30s'
        },
        {
            group: [40, 49],
            label: '40s'
        },
        {
            group: [50, 59],
            label: '50s'
        },
        {
            group: [60, 69],
            label: '60s'
        },
        {
            group: 70,
            comparator: 'greater',
            label: '70+'
        }
    ];

    const ageGroupData = ageGroup.map(ag => {
        if (Array.isArray(ag.group)) {
            const f = age.filter(pd => {
                return (
                    Number(pd.key) >= ag.group[0] &&
                    Number(pd.key) <= ag.group[1]
                );
            });

            return {
                key: ag.label,
                count: _.sumBy(f, 'count')
            };
        }

        if (ag.comparator === 'equal') {
            const f = age.filter(pd => Number(pd.key) === ag.group);

            return {
                key: ag.label,
                count: _.sumBy(f, 'count')
            };
        }

        const f = age.filter(pd => Number(pd.key) >= ag.group);

        return {
            key: ag.label,
            count: _.sumBy(f, 'count')
        };
    });

    const salaryAnnualData = countUniqBy('salaryAnnual');
    const salaryWeeklyData = countUniqBy('salaryWeekly');
    const hasSolarPVData = countUniqBy('hasSolarPV');

    const options = [
        {
            label: 'Select a Category',
            data: '',
            description: ''
        },
        {
            label: 'Gender',
            data: genderData,
            description: 'What is your gender?'
        },
        {
            label: 'Age',
            data: ageGroupData,
            description: 'What is your age?'
        },
        {
            label: 'Has Home',
            data: hasHomeData,
            description: 'Do you own, or are you renting your home?'
        },
        {
            label: 'Trust Worthiness',
            data: trustWorthinessData,
            description:
                'How trustworthy would you consider these information providers?'
        },
        {
            label: 'Salary Annual',
            data: salaryAnnualData,
            description:
                'Please estimate your ANNUAL HOUSEHOLD income below. We are interested in your GROSS INCOME, which is your income before tax and other deductions, and an estimate for the whole of your household.'
        },
        {
            label: 'Salary Weekly',
            data: salaryWeeklyData,
            description:
                'Please estimate your WEEKLY HOUSEHOLD income below. We are interested in your GROSS INCOME, which is your income before tax and other deductions, and an estimate for the whole of your household.'
        },
        {
            label: 'Has SolarPV',
            data: hasSolarPVData,
            description:
                'Do you have a solar PV system installed at your property?'
        }
    ];
    const select = d3.select('#select-view').on('change', function(k) {
        const selectValue = d3.select('#select-view').property('value');
        const getData = options.filter(o => o.label === selectValue)[0];
        if (!getData.data) return;
        d3.select('#description').text(getData.description);
        generateChart(getData.data);
    });

    const renderOptions = select
        .selectAll('option')
        .data(options)
        .enter()
        .append('option')
        .text(d => d.label);

    const svgWidth = 1200;
    const svgheight = 600;
    const svg = d3
        .select('svg')
        .attr('width', svgWidth)
        .attr('height', svgheight);

    const margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        g = svg
            .append('g')
            .classed('chart-area', true)
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

    const width = svgWidth - margin.left - margin.right;
    const height = svgheight - margin.top - margin.bottom;
    generateChart(genderData);

    function generateChart(chartData) {
        d3
            .select('.chart-area')
            .selectAll('*')
            .remove();

        const x = d3
            .scaleBand()
            .rangeRound([0, width])
            .padding(0.1);

        const y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(
            chartData.map(function(d) {
                return d.key;
            })
        );
        y.domain([
            0,
            d3.max(chartData, function(d) {
                return Number(d.count);
            })
        ]);

        g
            .append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        g
            .append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Count');

        g
            .selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.key);
            })
            .attr('y', function(d) {
                return y(Number(d.count));
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return height - y(Number(d.count));
            });

        g
            .selectAll('.text')
            .data(chartData)
            .enter()
            .append('text')
            .attr('class', 'text')
            .attr('x', function(d) {
                return x(d.key);
            })
            .attr('y', function(d) {
                return 30 + y(Number(d.count));
            })
            .text(d => d.count)
            .attr('fill', 'white');
    }
});
