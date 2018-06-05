// var market_data = create_d3_data(0.54, [5, 15, -50, 250])
//console.log('market_data: ', market_data)

async function create_d3_data(probability, price_set) {
    //1. create a market data (price, time) series
    //user input
    // const probability = 0.54
    //user input
    // const price_set = [5, 15, -50, 250]
    //user input
    //const market_speed = 3
    //user input
    //const volatility = 'high'

    const prices = await create_random_price_data(probability, price_set)
    const times = await createEventTime(prices.length)
    const market_data = await combinePriceTime(prices, times)
    console.log('market_data: ', market_data)
    //console.log('button clicked create_d3_data')
    return market_data
}

///////////////////////////create_random_price_data.js
function create_random_price_data(probability, prices_array) {
    let parsed_prices = parse_price_array(prices_array)
    let price_data = []
    for (var i = 0; i < parsed_prices.length; i++) {
        let parsed_price_set = parsed_prices[i]
        let partial_prices = createTrend(probability, parsed_price_set)
        price_data = price_data.concat(partial_prices)
        partial_prices = []
    }
    //console.log('price_data: ', price_data)
    return price_data
}

function createTrend(probability, prices_array) {
    //prices_array = [init_price, target_price]
    let trend_prices = []
    let init_price = prices_array[0]
    let target_price = prices_array[1]
    let current_price = init_price

    //create trend UP
    if (init_price <= target_price) {
        while (current_price < target_price) {
            const random_num = Math.random()
            if (random_num <= probability) {
                current_price = Math.round(current_price + 1.0)
            }
            else {
                current_price = Math.round(current_price - 1.0)
            }

            trend_prices.push(current_price)
        }
    }
    // create trend DOWN
    else if (init_price > target_price) {
        while (current_price > target_price) {
            const random_num = Math.random()
            if (random_num <= probability) {
                current_price = Math.round(current_price - 1.0)
            }
            else {
                current_price = Math.round(current_price + 1.0)
            }

            trend_prices.push(current_price)
        }
    }

    return trend_prices
}

function parse_price_array(price_arr) {
    let temp_arr = []
    let x = []
    let create_trend_array = []
    for (var i = 0; i < price_arr.length - 1; i++) {
        x = temp_arr.concat(price_arr[i], price_arr[i + 1])
        create_trend_array.push(x)
        x = []
        temp_arr = []
    }
    return create_trend_array
}
/////////////////////////////////////////////////////////////
//time_elapsed_generator.js
var num_fast_run = 11
var normal_times = [0.1, 1, 3, 4, 5, 3, 2, 3, 4, 5, 6, 7, 8, 9, 10]

//forEach price from price_results [], createEventTime() and create market_data (price, time)
function createEventTime(num) {
    var i = 0
    var j = 0
    var elapsed_time = []
    while (i < num) {
        var index = Math.floor(Math.random() * normal_times.length)
        //console.log('index: ', index)
        //console.log('normal_times[index]:', normal_times[index])

        // if you randomly hit on a 'fast time', make it a 'run' of fast_times 
        if (normal_times[index] < 1) {
            while (j < num_fast_run) {
                var fast_times = Math.random()
                //console.log('goin on a run')
                elapsed_time.push(fast_times)
                j++
                i++
            }
        }
        else {
            elapsed_time.push(normal_times[index])
            i++
        }
        j = 0
    }
    var time_traded = accumulator(elapsed_time)

    return time_traded
}

function accumulator(array) {
    var current_sum = 0
    var sum_array = []
    for (var i = 0; i < array.length - 1; i++) {
        current_sum = Math.round(array[i] + current_sum, 3)
        //console.log('array[i]: ', array[i])
        //console.log('current_sum: ', current_sum)
        sum_array.push(current_sum)
    }
    return sum_array
}
////////////////////////////////////////////////////
//combine_price_time.js
function combinePriceTime(price_array, time_array) {
    let price_time = {}
    let market_data = []
    for (var i = 0; i < price_array.length; i++) {
        price_time.price = price_array[i]
        price_time.time = time_array[i]
        market_data.push(price_time)
        price_time = {}
    }
    return market_data
}
///////////////////////////////////////////////////
