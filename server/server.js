const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'fmsdazgh4245dashd83242dyid';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://pinterbence5:EduSzakdoga2023@eduszakdoga.b4zeaqb.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {name, email, password, userType} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password,salt),
            userType});
        res.json(userDoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});

    if (!userDoc) {
        res.status(400).json('Nem található felhasználó ilyen e-mail címmel.');
        return;
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({email,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                email,
            });
        });
    } else {
        res.status(400).json('Nem megfelelő e-mail vagy jelszó!');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Nincs érvényes token!' });
    }    
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Érvénytelen token!' });
      }
      res.json(info);
    });
  });

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('Logout OK');
})

app.listen(4000);