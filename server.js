const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const moment = require('moment')
const { PythonShell } = require("python-shell");
const admin = require('firebase-admin')
var serviceAccount = require("./creds.json");


const app = express()

app.set('view engine', 'ejs')
app.use(express.static('views'))
app.set('views', __dirname + '/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://innovacer-1ec3d.firebaseio.com"
});

let db = admin.firestore()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.visitor.project@gmail.com',
        pass: 'TarunSingh201922'
    }
});
// console.log(moment().fromNow())
app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/checkout', (req, res) => {
    let datarec = []
    let docref = db.collection('visitors');
    let allvisits = docref.orderBy('timestamp', 'desc').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                //console.log(doc.id, '=>', doc.data());
                let temp = doc.data()
                temp['id'] = doc.id
                temp['timestamp'] = moment.unix(temp['timestamp']).fromNow()
                    //console.log("Moment---" + temp['timestamp'])
                datarec.push(temp)
            });
            res.render('checkout.ejs', { data: datarec })
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.send("SOME ERROR!")
        });
})

app.get('/pastsession', (req, res) => {
    let datarec = []
    let docref = db.collection('visited');
    let allvisits = docref.orderBy('outtime', 'desc').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let temp = doc.data()
                temp['id'] = doc.id
                temp['concluded'] = moment.unix(temp['outtime']).fromNow()
                datarec.push(temp)
            });
            res.render('pastsession.ejs', { data: datarec })
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.send("SOME ERROR!")
        });

})

app.get('/checkoutresult/:id', async(req, res) => {
    console.log(req.params.id)
    const refid = req.params.id
    let temp = ''
    let dref = db.collection('visited')
    let docref = db.collection('visitors').doc(refid);
    try {
        let doc = await docref.get()
        temp = doc.data()
    } catch (err) {
        console.logger(err)
    }

    let delref = await db.collection('visitors').doc(refid).delete()
    const vname = temp.vname
    const vemail = temp.vemail
    const vmobile = temp.vmobile
    const hname = temp.hname
    const hemail = temp.hemail
    const hmobile = temp.hmobile
    const haddress = temp.haddress
    const intime = temp.timestamp
    const outtime = moment(new Date())
    const duration = Math.round(moment.duration(outtime.diff(moment.unix(intime))).asMinutes())
    var mailOptions = {
        from: 'noreply.visitor.project@gmail.com',
        to: vemail,
        subject: '[no-reply] Summary of your Visit at Innovacer!',
        html: `<h2>Hello! ${vname.split(' ')[0]},\n</h2>
                        <p>Hope you had a pleasant meeting with ${hname}.<p>
                        <p>Here are the details of your visit:</p>
                        <p>Visitor Name: ${vname}<br>Visitor Email: ${vemail}<br>Visitor Contact: ${vmobile}\n</p>
                        <p>Host Name: ${hname}<br>Host Email: ${hemail}<br>Host Contact: ${hmobile}<br>Host Address: ${haddress}</p>
                        <p>Meeting Duration: ${duration} minute(s).<br>Check In Time: ${moment.unix(intime).format("YYYY-MMMM-DD | HH:mm")}<br>Check Out Time: ${outtime.format("YYYY-MMMM-DD | HH:mm")}</p>
                        <img src="cid:alsoveryuniqueimg@nodemailer.com"/><br>
                        <h3>Thank You for your visit!</h3><br><hr><br>
                        <footer><i>Regards,<br>Front Desk,<br>Innovacer Office<br></i></footer>`,
        attachments: [{
            filename: 'thanks.jpg',
            path: './views/images/thanks.jpg',
            cid: 'alsoveryuniqueimg@nodemailer.com'
        }]
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    // client.messages.create({
    //         to: vmobile,
    //         from: '+15735356604',
    //         body: `Hello! ${vname.split(' ')[0]},\n` +
    //             `Hope you had a pleasant meeting with ${hname}.` +
    //             `Here are the details of your visit:` +
    //             `Visitor Name: ${vname}\nVisitor Email: ${vemail}\nVisitor Contact: ${vmobile}\n` +
    //             `Host Name: ${hname}\nHost Email: ${hemail}\nHost Contact: ${hmobile}\n` +
    //             `Meeting Duration: ${duration} minute(s).\nCheck In Time: ${moment.unix(intime).format("YYYY-MMMM-DD | HH:mm")}\nCheck Out Time: ${outtime.format("YYYY-MMMM-DD | HH:mm")}\n` +
    //             `Thank You for your visit!\n` +
    //             `Regards,\nFront Desk,\nInnovacer Office`
    //     })
    //     .then((message) => { console.log(message.id) })

    dref.add({
        vname: vname,
        vemail: vemail,
        vmobile: vmobile,
        hname: hname,
        hemail: hemail,
        hmobile: hmobile,
        intime: intime,
        haddress: haddress,
        outtime: outtime.unix(),
        duration: duration
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    })
    res.render('checkoutresults.ejs', { vname: vname, hname: hname, duration: duration, vemail: vemail })
})

app.get('/checkin', (req, res) => {
    res.render('checkin.ejs')
})

app.post('/checkin', (req, res) => {
    console.log(req.body)
    const vname = req.body.vname
    const vemail = req.body.vemail
    const vmobile = req.body.vmobile
    const hname = req.body.hname
    const hemail = req.body.hemail
    const hmobile = req.body.hmobile
    const timestamp = moment().unix()
    const haddress = req.body.haddress
    const timestampformatted = moment().format("YYYY-MMMM-DD | HH:mm")
    let docRef = db.collection('visitors').add({
        vname: vname,
        vemail: vemail,
        vmobile: vmobile,
        hname: hname,
        hemail: hemail,
        hmobile: hmobile,
        haddress: haddress,
        timestamp: timestamp
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });
    var mailOptions = {
        from: 'noreply.visitor.project@gmail.com',
        to: hemail,
        subject: '[no-reply] A Visitor arriving!',
        html: `<h2>Hello! ${hname.split(' ')[0]},\n</h2>
                <p>${vname} has checked in to visit you.<p>
                <p>Please find their detail below:</p>
                <p>${vname.split(' ')[0]}'s email: ${vemail} and contact: ${vmobile}\n</p>
                <img src="cid:veryuniqueimg@nodemailer.com"/><br>
                <h3>Have a pleasant meeting!</h3><br><hr><br>
                <footer><i>Regards,<br>Front Desk,<br>Innovacer Office<br></i></footer>`,
        attachments: [{
            filename: 'visitor.jpg',
            path: './views/images/visitor.jpg',
            cid: 'veryuniqueimg@nodemailer.com'
        }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    const mno = hmobile
    const msg = `Hello! ${hname.split(' ')[0]},\n` +
        `${hname} has checked in to visit you.` +
        `Here are the details of the visitor:` +
        `Visitor Name: ${vname}\nVisitor Email: ${vemail}\nVisitor Contact: ${vmobile}\n` +

        `Check In Time: ${timestampformatted}\n` +
        `Hope you have a pleasant meeting!\n` +
        `Regards,\nFront Desk,\nInnovacer Office`
    const options = {
        mode: 'text',
        encoding: 'utf8',
        pythonOptions: ['-u'],
        scriptPath: './',
        args: [mno, msg],
        pythonPath: 'C:/Users/Acer/AppData/Local/Programs/Python/Python36/python.exe',
    };
    // const test = new PythonShell('./sms.py', options);
    // test.on('message', (message) => {
    //     console.log(message)
    // });
    res.render('checkinresult.ejs', {
        vname: vname,
        vemail: vemail,
        vmobile: vmobile,
        hname: hname,
        hemail: hemail,
        hmobile: hmobile,
        timestamp: timestampformatted
    })
})



let port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('App running on port ' + port)
})