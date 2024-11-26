const express = require("express");
const bodyparser = require("body-parser");
const Translate = require('@vitalets/google-translate-api');
const cors = require('cors');

// Importing functions for language type manipulation
const getlangcode = require('./Language DB/languages').getlangcode;
const checklang = require('./Language DB/languages').checklang;
const auth = require('./auth');


// Defining the app
const app = express();

// Allowing app to use the body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(cors());

// app.use(auth);
// Starting route
app.get('/api/', (req, res) => {
    res.status(200).json({
        message: `Translation tool test`
    });
})

// POST REST Api for translating the text from one to another languages both provided from the user
app.post('/api/translate', (req, res) => {

    // If any field is left empty an error will be thrown
    if (!req.body.text || !req.body.to || !req.body.from)
        return res.status(406).json({
            "msg": "Please fill all the required fields"
        });

    // Making a dummy object for storing the user's data
    let translate = {
        lang_to: req.body.to,
        lang_from: req.body.from,
        text: req.body.text
    };

    // Checking whether provided languages are supported by our translator or not 
    if (!checklang(translate.lang_to) || !checklang(translate.lang_from))
        return res.status(409).json({
            "msg": "Either of the  entered language,  is not supported"
        })

    // Translating language names to ISO 639-1 code    
    translate.lang_from = getlangcode(translate.lang_from);
    translate.lang_to = getlangcode(translate.lang_to);

    // Calling translation API
    Translate(translate.text, {
        to: translate.lang_to,
        from: translate.lang_from
    }).then(
        (data) => {
            // Let's check that given text follow the rule of it's given language grammar
            var check = data.from.language.iso;

            // If it don't follow then throw an error
            if (check !== translate.lang_from) {
                return res.status(400).json({ message: `The given text is not in the format of it's given language` });
            }
            // Returning the result
            return res.status(200).json({translatedText :  data.text});
        }
    ).catch((err) => {
        return res.status(500).json(err);
    })
});

// Handling wrongful requests
app.get('*', (req, res) => {
    res.redirect('/api/');
})

// Defining port
const PORT = process.env.PORT || 5757;

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else {
        console.log(` Translate app is live at http://localhost:${PORT}`);
    }
})
