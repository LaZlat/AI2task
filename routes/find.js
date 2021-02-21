const express = require('express')
const router = express.Router()
const fs = require('fs');

function Obj(distance, idobject, operator, plan, price, min, sms, gb) {
    this.distance = distance;
    this.idobject = idobject;
    this.operator = operator;
    this.plan = plan;
    this.price = price;
    this.min = min;
    this.sms = sms;
    this.gb = gb;
}

function distanceMetricOne(sourceX, sourceY, sourceZ, sourceW, targetX, targetY, targetZ, targetW, idobject, operator, plan, pricePrio, minPrio, smsPrio, gbPrio) {
    return new Obj(Math.sqrt(pricePrio * Math.pow((sourceX - targetX), 2) + minPrio *
        Math.pow((sourceY - targetY), 2) + smsPrio * Math.pow((sourceZ - targetZ), 2) + gbPrio *
        Math.pow((sourceW - targetW), 2)), idobject, operator, plan, targetX, targetY, targetZ, targetW);
}

function distanceMetricTwo(sourceX, sourceY, sourceZ, sourceW, targetX, targetY, targetZ, targetW, idobject, operator, plan, pricePrio, minPrio, smsPrio, gbPrio) {
    return new Obj(Math.max(pricePrio * Math.abs((sourceX - targetX)),
            minPrio * Math.abs((sourceY - targetY)), smsPrio * Math.abs((sourceZ - targetZ)), gbPrio * Math.abs((sourceW - targetW))), idobject, operator, plan,
        targetX, targetY, targetZ, targetW);
}

function readFile() {
    try {
        var data = fs.readFileSync('planu_santrauka.csv', 'utf8');
        const lines = data.split('\n');

        let plans = [];
        for (var i = 1; i < lines.length; i++) {
            let col = lines[i].split(',');
            plans.push({
                idobject: col[0],
                operator: col[1],
                plan: col[2],
                price: col[3],
                min: col[4],
                sms: col[5],
                gb: col[6].replace(/[\r\n]+/gm, "")
            });
        }
        return plans;
    } catch (e) {
        return null;
    }
}

function compare(a, b) {
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
    return 0;
}

function checkOptions(plan) {
    let result = true;
    if (this[0] == 1) result &= (plan.min == -1);
    if (this[1] == 1) result &= (plan.sms == -1);
    if (this[2] == 1) result &= (plan.gb == -1);
    return result;
}

router.get("/", function(req, res) {
    let distMetric = req.query.met;
    let price = req.query.price;
    let pricePrio = req.query.priceprio / 20;
    let min = req.query.min;
    let minPrio = req.query.minprio / 20;
    let sms = req.query.sms;
    let smsPrio = req.query.smsprio / 20;
    let gb = req.query.gb;
    let gbPrio = req.query.gbprio / 20;

    let filter = req.query.opt || 0;

    let neighbourDistances = [];
    let plans = readFile();

    plans = plans.filter(checkOptions, filter);

    plans.forEach(plan => {
        if (distMetric == 1)
            neighbourDistances.push(distanceMetricOne(price, min, sms, gb, plan.price, plan.min, plan.sms, plan.gb, plan.idobject, plan.operator, plan.plan,
                pricePrio, minPrio, smsPrio, gbPrio));
        else {
            neighbourDistances.push(distanceMetricTwo(price, min, sms, gb, plan.price, plan.min, plan.sms, plan.gb, plan.idobject, plan.operator, plan.plan,
                pricePrio, minPrio, smsPrio, gbPrio));
        }
    });
    neighbourDistances = neighbourDistances.sort(compare);
    let finalPlan = [];
    finalPlan.push(neighbourDistances[0]);

    for (let i = 1; i < neighbourDistances.length; i++) {
        if (neighbourDistances[i].distance == finalPlan[0].distance) {
            finalPlan.push(neighbourDistances[i])
        }
    }

    res.send(finalPlan);
})

function operatorsArray(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
        if (a.indexOf(arr[i].operator) === -1 && arr[i].operator !== '')
            a.push(arr[i].operator);
    return a;
}

function cheapestPlan(arr, op) {
    let filtered = arr.filter((plan) => {
        return plan.operator == op;
    });

    let min = filtered[0];
    for (let i = 1, l = filtered.length; i < l; i++) {
        if (filtered[i] < min) {
            min = filtered[i];
        }
    }

    return min;
}

router.get("/top", function(req, res) {
    let plans = readFile();

    let operators = operatorsArray(plans);

    let result = [];
    operators.forEach(operator => {
        result.push(cheapestPlan(plans, operator));
    });

    result = result.sort((a, b) => {
        return Number(a.price) < Number(b.price) ? -1 : 1;
    })

    res.send(result);
})

module.exports = router;