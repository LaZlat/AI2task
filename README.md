# AI2task

http://localhost:3000/ - GET - Grazina visus planus\
http://localhost:3000/find/?met=1&price=8&priceprio=25&min=-1&minprio=50&sms=-1&smsprio=5&gb=8&gbprio=20 - GET\
            met - 1 arba 2 metrika\
            price - plano kaina, jei su centains naudoti . \
            priceprio - prioritetas nuo 0 iki 100. Bendrai sudejus visu prioritetas negali virsyti 100 (tipo procentai) Reikia validation fronte\
            min - min kiekis\
            minprio - prioritetas nuo 0 iki 100. Bendrai sudejus visu prioritetas negali virsyti 100 (tipo procentai) Reikia validation fronte\
            sms - sms kiekis\
            smsprio - prioritetas nuo 0 iki 100. Bendrai sudejus visu prioritetas negali virsyti 100 (tipo procentai) Reikia validation fronte\
            gb - gb kiekis\
            gbprio - prioritetas nuo 0 iki 100. Bendrai sudejus visu prioritetas negali virsyti 100 (tipo procentai) Reikia validation fronte\
            JEI NERIBOTI SIUSTI -1


http://localhost:3000/find/?opt=001&met=1&price=8&priceprio=25&min=-1&minprio=50&sms=-1&smsprio=5&gb=8&gbprio=20 - GET
            viskas tas pats tik yra opt - pirmas sk. yra neribotos min, antras - sms, o trecias gb. Jeigu siunti 111 tai rodys plana kur yra visi neriboti.
            
http://localhost:3000/find/top - GET grazina visu tiekeju pacius pigiausius planus :)
