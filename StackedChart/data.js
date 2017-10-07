/**
 * Created by bikramkawan on 10/7/17.
 */
/**
 * Created by bikramkawan on 10/7/17.
 */
// Line graph data
var glucoses = [{
    date: "1-May-12",
    value: "450"
}, {
    date: "30-Apr-12",
    value: "120"
}, {
    date: "27-Apr-12",
    value: "67"
}, {
    date: "26-Apr-12",
    value: "89"
}, {
    date: "25-Apr-12",
    value: "99"
}];

// Horizontal red and green lines as well as green area
var limits = {
    hyper: "550",
    upper: "490",
    target: "250",
    lower: "120",
    hypo: "50"
};

// Bar graph from bottom.
// 0-100: 0 - 1/3 of graph height (continuously)
// >100 : 1/3 + Fade out visualization
var meals = [{
    date: "1-May-12",
    value: "20"
}, {
    date: "30-Apr-12",
    value: "42"
}, {
    date: "27-Apr-12",
    value: "67"
}, {
    date: "26-Apr-12",
    value: "89"
}, {
    date: "25-Apr-12",
    value: "120"
}];

// Part of stacked bar from top.
// Light green for "short" and dark green for "long" acting medication
// <10  : 1/27 of graph height
// 10-19: 2/27 of graph height
// >20  : 3/27 of graph height
var medications = [{
    date: "1-May-12",
    value: "5",
    type: "short"
}, {
    date: "30-Apr-12",
    value: "12",
    type: "long"
}, {
    date: "30-Apr-12",
    value: "7",
    type: "short"
}, {
    date: "26-Apr-12",
    value: "21",
    type: "long"
}, {
    date: "25-Apr-12",
    value: "17",
    type: "short"
}];

// Orange part of stacked bar from top
// value = intensity
// 1: 1/27 of graph height
// 2: 2/27 of graph height
// 3: 3/27 of graph height
var activities = [{
    date: "1-May-12",
    value: "1"
}, {
    date: "30-Apr-12",
    value: "2"
}, {
    date: "30-Apr-12",
    value: "3"
}, {
    date: "26-Apr-12",
    value: "1"
}, {
    date: "25-Apr-12",
    value: "2"
}];
