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


var newdata = {
    "glucose": [
        {
            "source": "ot5bt",
            "created": "02.10.17 06:58",
            "value": 111,
            "type": "control",
            "comment": "gerät getestet"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 07:00",
            "value": 90,
            "type": "preprandial",
            "comment": "noch kein hunger"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 10:00",
            "value": 45,
            "type": "preprandial",
            "comment": "jetzt ist mir schon schlecht vor hunger"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 12:30",
            "value": 120,
            "type": "preprandial"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 12:30",
            "value": 444,
            "type": "invalid",
            "comment": "noch nutella am finger gehabt"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 13:30",
            "value": 250,
            "type": "postprandial"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 15:05",
            "value": 105,
            "type": "none"
        },
        {
            "source": "ot5bt",
            "created": "02.10.17 18:02",
            "value": 450,
            "type": "invalid",
            "comment": "hände vorher nicht gewaschen"
        },
        {
            "source": "web",
            "created": "02.10.17 18:02",
            "value": 75,
            "type": "preprandial"
        },
        {
            "source": "app",
            "created": "02.10.17 19:45",
            "value": 133,
            "type": "postprandial"
        },
        {
            "source": "app",
            "created": "02.10.17 23:15",
            "value": 124,
            "type": "generic",
            "comment": "vor schlafengehen"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 08:58",
            "value": 111,
            "type": "control",
            "comment": "gerät getestet"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 09:00",
            "value": 80,
            "type": "preprandial",
            "comment": "noch kein hunger"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 10:00",
            "value": 60,
            "type": "preprandial",
            "comment": "mir ist schon schlecht vor hunger"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 12:30",
            "value": 110,
            "type": "preprandial"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 13:45",
            "value": 315,
            "type": "postprandial"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 15:05",
            "value": 105,
            "type": "none",
            "comment": "nur mal so zwischendrin"
        },
        {
            "source": "ot5bt",
            "created": "03.10.17 17:55",
            "value": 30,
            "type": "invalid",
            "comment": "streifen nicht i.o."
        },
        {
            "source": "web",
            "created": "03.10.17 17:55",
            "value": 75,
            "type": "preprandial"
        },
        {
            "source": "app",
            "created": "03.10.17 19:45",
            "value": 202,
            "type": "postprandial"
        },
        {
            "source": "app",
            "created": "03.10.17 23:15",
            "value": 143,
            "type": "generic",
            "comment": "vor schlafengehen"
        },
        {
            "source": "ot5bt",
            "created": "04.10.17 06:58",
            "value": 111,
            "type": "control",
            "comment": "gerät getestet"
        },
        {
            "source": "ot5bt",
            "created": "04.10.17 07:00",
            "value": 160,
            "type": "preprandial",
            "comment": "noch kein hunger"
        },
        {
            "source": "ot5bt",
            "created": "04.10.17 12:30",
            "value": 260,
            "type": "preprandial"
        },
        {
            "source": "ot5bt",
            "created": "04.10.17 12:30",
            "value": 580,
            "type": "invalid",
            "comment": "noch nutella am finger gehabt"
        },
        {
            "source": "ot5bt",
            "created": "04.10.17 13:30",
            "value": 115,
            "type": "postprandial"
        },
        {
            "source": "web",
            "created": "04.10.17 18:02",
            "value": 49,
            "type": "preprandial"
        },
        {
            "source": "app",
            "created": "04.10.17 19:45",
            "value": 65,
            "type": "postprandial"
        },
        {
            "source": "app",
            "created": "04.10.17 23:15",
            "value": 118,
            "type": "generic",
            "comment": "vor schlafengehen"
        }
    ],
    "meal": [
        {
            "source": "app",
            "created": "02.10.17 08:00",
            "value": 20,
            "type": "breakfast",
            "comment": "apfel"
        },
        {
            "source": "app",
            "created": "02.10.17 10:35",
            "value": 15,
            "type": "snack",
            "comment": "traubenzucker"
        },
        {
            "source": "app",
            "created": "02.10.17 12:30",
            "value": 80,
            "type": "lunch",
            "comment": "nudeln mit tomatensoße"
        },
        {
            "source": "web",
            "created": "02.10.17 18:30",
            "value": 35,
            "type": "dinner",
            "comment": "käsebrot"
        },
        {
            "source": "web",
            "created": "02.10.17 21:30",
            "value": 10,
            "type": "snack",
            "comment": "joghurt"
        },
        {
            "source": "app",
            "created": "03.10.17 08:00",
            "value": 8,
            "type": "breakfast",
            "comment": "apfel"
        },
        {
            "source": "app",
            "created": "03.10.17 10:35",
            "value": 20,
            "type": "snack",
            "comment": "honig"
        },
        {
            "source": "app",
            "created": "03.10.17 12:30",
            "value": 110,
            "type": "lunch",
            "comment": "pizza"
        },
        {
            "source": "web",
            "created": "03.10.17 18:30",
            "value": 20,
            "type": "dinner",
            "comment": "gemüsepfanne"
        },
        {
            "source": "app",
            "created": "04.10.17 10:35",
            "value": 15,
            "type": "snack",
            "comment": "apfel"
        },
        {
            "source": "app",
            "created": "04.10.17 12:30",
            "value": 38,
            "type": "lunch",
            "comment": "salat mit putenbrust und brot"
        },
        {
            "source": "web",
            "created": "04.10.17 18:30",
            "value": 10,
            "type": "dinner",
            "comment": "gemüsesuppe"
        }
    ],
    "activity": [
        {
            "source": "app",
            "created": "02.10.17 08:30",
            "duration": 1,
            "intensity": "strong",
            "type": "jog",
            "comment": "alter, war das anstrengend"
        },
        {
            "source": "web",
            "created": "02.10.17 13:00",
            "duration": 0.75,
            "intensity": "light",
            "type": "walking",
            "comment": "mittagspause, parkrunde"
        },
        {
            "source": "app",
            "created": "02.10.17 19:45",
            "duration": 1.25,
            "intensity": "medium",
            "type": "fitness_center",
            "comment": "bodypump"
        },
        {
            "source": "web",
            "created": "03.10.17 13:00",
            "duration": 0.75,
            "intensity": "medium",
            "type": "walking",
            "comment": "mittagspause, parkrunde"
        },
        {
            "source": "app",
            "created": "03.10.17 19:45",
            "duration": 1.25,
            "intensity": "strong",
            "type": "fitness_center",
            "comment": "bodypump"
        },
        {
            "source": "app",
            "created": "04.10.17 08:30",
            "duration": 1,
            "intensity": "medium",
            "type": "jog",
            "comment": "alter, war das anstrengend"
        },
        {
            "source": "web",
            "created": "04.10.17 13:00",
            "duration": 0.75,
            "intensity": "light",
            "type": "walking",
            "comment": "mittagspause, parkrunde"
        }
    ],
    "medication": [
        {
            "source": "app",
            "created": "02.10.17 07:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer morgens"
        },
        {
            "source": "app",
            "created": "02.10.17 08:25",
            "value": 3,
            "name": "novorapid",
            "type": "bolus_insulin",
            "comment": "nach breakfast"
        },
        {
            "source": "web",
            "created": "02.10.17 10:35",
            "value": 2,
            "name": "mix_insulin",
            "type": "mix_insulin"
        },
        {
            "source": "web",
            "created": "02.10.17 11:11",
            "value": 1,
            "name": "aspirin",
            "type": "other_medication",
            "comment": "kopfschmerzen"
        },
        {
            "source": "app",
            "created": "02.10.17 12:30",
            "value": 6,
            "name": "novorapid",
            "type": "bolus_insulin",
            "comment": "zum lunch"
        },
        {
            "source": "app",
            "created": "02.10.17 23:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer abends"
        },
        {
            "source": "app",
            "created": "03.10.17 07:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer morgens"
        },
        {
            "source": "app",
            "created": "03.10.17 12:30",
            "value": 3,
            "name": "novorapid",
            "type": "bolus_insulin",
            "comment": "zum lunch"
        },
        {
            "source": "app",
            "created": "03.10.17 23:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer abends"
        },
        {
            "source": "app",
            "created": "04.10.17 07:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer morgens"
        },
        {
            "source": "app",
            "created": "04.10.17 08:25",
            "value": 10,
            "name": "novorapid",
            "type": "bolus_insulin",
            "comment": "nach breakfast"
        },
        {
            "source": "web",
            "created": "04.10.17 10:35",
            "value": 2,
            "name": "mix_insulin",
            "type": "mix_insulin"
        },
        {
            "source": "web",
            "created": "04.10.17 11:11",
            "value": 1,
            "name": "aspirin",
            "type": "other_medication",
            "comment": "kopfschmerzen"
        },
        {
            "source": "app",
            "created": "04.10.17 12:30",
            "value": 7,
            "name": "novorapid",
            "type": "bolus_insulin",
            "comment": "zum lunch"
        },
        {
            "source": "app",
            "created": "04.10.17 23:00",
            "value": 5,
            "name": "lantus",
            "type": "basis_insulin",
            "comment": "wie immer abends"
        }
    ]
}


var limits = [{
    label: 'hyper',
    value: 550
},
    {
        label: 'target',
        value: 250
    },

    {
        label: 'hypo',
        value: 50
    }

];


var greenAreaLimits = [{
    label: 'upper',
    value: 490
}, {
    label: 'lower',
    value: 120
}]


function formatData() {
    var formatTime = d3.timeParse("%d.%m.%y %H:%M");

    const glucoseNew = newdata.glucose;
    const meal = newdata.meal;
    const activity = newdata.activity;
    const medication = newdata.medication;


// format the data
    const lineData = glucoseNew.map(function (d) {
        return {
            date: formatTime(d.created),
            close: parseFloat(d.value)
        }

    });

    const bardata = meal.map((d)=> {
        return {
            date: formatTime(d.created),
            value: parseFloat(d.value)
        }

    });


    const lightGreenData = medication.map((d)=> {
        return {
            date: formatTime(d.created),
            value: parseFloat(d.value)
        }

    });

    const orangeData = activity.map((d)=> {
        return {
            date: formatTime(d.created),
            value: parseFloat(d.duration)
        }

    });


    return {lineData, bardata, lightGreenData, orangeData}


}


function bottomBarHeight(d, height) {
    return d <= 100 ? (height / 3) : (height / 3 + 20)

}

function calcGreenHeight(data, height) {

// <10 : 1/27 of graph height
// 10-19: 2/27 of graph height
// >20 : 3/27 of graph height

    if (data.value < 10) return (height / 27)
    if (data.value >= 10 && data.value < 20) return ((2 / 27) * height)
    if (data.value > 20) return ((3 / 27) * height)


}


function calcOrangeHeight(d, height) {

// <10 : 1/27 of graph height
// 10-19: 2/27 of graph height
// >20 : 3/27 of graph height

    if (d === 'light') return (height / 27)
    if (d === 'medium') return ((2 / 27) * height)
    if (d === 'strong') return ((3 / 27) * height)

}

function fillCircle(d) {


    return (d >= greenAreaLimits[1].value && d < greenAreaLimits[0].value) ? 'green' : 'red'


}