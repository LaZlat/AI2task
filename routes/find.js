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
        Math.pow((sourceW - targetW), 2)), idobject, operator, plan, sourceX, sourceY, sourceZ, sourceW);
}

function distanceMetricTwo(sourceX, sourceY, sourceZ, sourceW, targetX, targetY, targetZ, targetW, idobject, operator, plan, pricePrio, minPrio, smsPrio, gbPrio) {
    return new Obj(Math.max(pricePrio * Math.abs((sourceX - targetX)),
        minPrio * Math.abs((sourceY - targetY)), smsPrio * Math.abs((sourceZ - targetZ)), gbPrio * Math.abs((sourceW - targetW))), idobject, operator, plan, 
        sourceX, sourceY, sourceZ, sourceW);
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
                gb: col[6].replace( /[\r\n]+/gm, "" )
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

router.get("/", function (req, res) {
    let distMetric = req.query.met;
    let price = req.query.price;
    let pricePrio = req.query.priceprio / 20;
    let min = req.query.min;
    let minPrio = req.query.minprio / 20;
    let sms = req.query.sms;
    let smsPrio = req.query.smsprio / 20;
    let gb = req.query.gb;
    let gbPrio = req.query.gbprio / 20;

    let neighbourDistances = [];
    let plans = readFile();

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

module.exports = router;