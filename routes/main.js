const express = require('express')
const router = express.Router()
const fs = require('fs');

router.get("/", function(req, res) {
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
        res.send(plans);
    } catch (e) {
        console.log('Error:', e.stack);
        return res.sendStatus(500);
    }
})

module.exports = router