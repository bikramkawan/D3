/**
 * Created by bikramkawan on 11/6/17.
 */
define(function (require) {
    let displaySettings = true;
    let displayFlagInformation = false;
    return {
        toggleSettings: function () {
            const that = this;
            d3.select('.settings')
                .on('click', function () {
                    displaySettings = !displaySettings;
                    if (displaySettings) {
                        d3.select(this).select('i').attr('class', 'fa fa-toggle-on fa-2x ')
                        d3.select('.bottom-container').style('display', 'flex')

                    } else {
                        d3.select(this).select('i').attr('class', 'fa fa-toggle-off fa-2x ')
                        d3.select('.bottom-container').style('display', 'none')
                    }

                });

        },
        toggleFlagDisplay: function () {
            const that = this;
            d3.select('.toggleFlag')
                .on('click', function () {
                    displayFlagInformation = !displayFlagInformation;
                    if (displayFlagInformation) {
                        d3.select(this).select('i').attr('class', 'fa fa-toggle-on fa-2x ')
                        d3.select('.inner-items').style('display', 'flex')

                    } else {
                        d3.select(this).select('i').attr('class', 'fa fa-toggle-off fa-2x ')
                        d3.select('.inner-items').style('display', 'none')
                    }

                });

        },
        toggleMode: function () {
            d3.select('.mode').on('click', ()=> {
                const isDark = d3.select('.mode').attr('class') === 'mode';
                d3.select('.mode').classed('dark', isDark);
                d3.selectAll('.axis').classed('darkMode', isDark)
                d3.select('.chart').classed('darkChart', isDark);

            })

        },


    }


})