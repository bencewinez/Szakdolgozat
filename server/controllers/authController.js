const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('../models/User');
const SubjectTopic = require('../models/SubjectTopics');
const SubjectTopicModel = require('../models/SubjectTopics');
const SubjectModel = require('../models/Subject');
const SubscriptionModel = require('../models/Subscription');
const LessonModel = require('../models/Lesson');
const LessonStatusModel = require('../models/LessonStatus');

const salt = bcrypt.genSaltSync(10);
const secret = 'fmsdazgh4245dashd83242dyid';

router.use(cors({credentials:true,origin:'http://localhost:3000'}));
router.use(express.json());
router.use(cookieParser());

mongoose.connect('mongodb+srv://pinterbence5:EduSzakdoga2023@eduszakdoga.b4zeaqb.mongodb.net/?retryWrites=true&w=majority');

router.post('/register', async (req,res) => {
    const {name, email, password, userType} = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ error: 'A megadott e-mail cím már foglalt!' });
        }
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

router.post('/login', async (req,res) => {
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

router.get('/profile', (req, res) => {
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

router.post('/logout', (req,res) => {
    res.cookie('token', '').json('Logout OK');
});

router.get('/userProfile', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        } 
        const userId = info.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a felhasználó lekérése közben!' });
        }
    });
});

router.post('/changePassword', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        } 
        const userId = info.id;
        const { currentPassword, newPassword } = req.body;
        try {
            const userDoc = await User.findById(userId);
            if (!userDoc) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, userDoc.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ error: 'A jelenlegi jelszó helytelen!' });
            }
            const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
            userDoc.password = hashedNewPassword;
            await userDoc.save();
            res.json({ message: 'A jelszó sikeresen módosítva lett!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a jelszó módosítása közben!' });
        }
    });
});

router.post('/changeData', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        } 
        const userId = info.id;
        const { newName, newEmail } = req.body;
        try {
            const userDoc = await User.findById(userId);
            if (!userDoc) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            const existingUser = await User.findOne({ newEmail });
            if (existingUser) {
                return res.status(402).json({ error: 'A megadott e-mail cím már foglalt!' });
            }
            if(newName !== ''){
                userDoc.name = newName;
            }
            if(newEmail !== ''){
                userDoc.email = newEmail;
            }
            await userDoc.save();
            res.json({ message: 'Az adat(ok) sikeresen módosítva lett(ek)!' });
        
        } catch (error) {
            return res.status(500).json({ error: 'Hiba az adat(ok) módosítása közben!' });
        }
    });

});

router.post('/deleteProfile', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        } 
        const userId = info.id;
        try {
            await LessonStatusModel.deleteMany({ userID: userId });
            await SubscriptionModel.deleteMany({ userId });
            const userDoc = await User.findByIdAndRemove(userId);
            if (!userDoc) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            res.clearCookie('token');
            res.json({ message: 'A profil sikeresen törölve lett!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a profil törlése közben!' });
        }
    });
});

module.exports = router;