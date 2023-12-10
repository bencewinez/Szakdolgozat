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

router.get('/getSubjectTopics', async (req, res) => {
    try {
        const subjectTopics = await SubjectTopicModel.find({}, 'name');
        res.json(subjectTopics);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a Tantárgy Témakörök lekérdezése közben!' });
    }
});

router.post('/addSubject', async (req, res) => {
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
            const { name, description, topic } = req.body;
            if (!name || !description || !topic) {
                return res.status(400).json({ error: 'Minden mezőt ki kell töltenie.' });
            }
            const userDoc = await User.findById(userId);
            if (!userDoc) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            const urlSlug = name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replace(/\s+/g, '_')
                .toLowerCase();
            const existingSubject = await SubjectModel.findOne({ urlSlug });
            if (existingSubject) {
                return res.status(400).json({ error: 'Ez a tantárgy név már létezik!' });
            }
            const subject = new SubjectModel({
                name,
                description,
                author: userDoc.name,
                authorID: userDoc._id,
                urlSlug,
                topic,
                lessonsCount: 0,
            });
            await subject.save();
            res.json(subject);
        } catch (error) {
            res.status(500).json({ error: 'Hiba a tantárgy létrehozása közben!' });
        }
    });
});

router.get('/getMySubjects', async (req, res) => {
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
            const mySubjects = await SubjectModel.find({ authorID: userId });
            res.json(mySubjects);
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a saját tantárgyak lekérése közben!' });
        }
    });
});

router.get('/getSubject/:urlSlug', async (req, res) => {
    try {
        const { urlSlug } = req.params;
        const subject = await SubjectModel.findOne({ urlSlug }, ' _id, name description author authorID topic lessonsCount');
        if (!subject) {
            return res.status(404).json({ error: 'A tantárgy nem található!' });
        }
        const { _id, name, description, author, authorID, topic, lessonsCount } = subject;
        const category = await SubjectTopicModel.findById(topic, 'name');
        const responseSubject = { _id, name, description, author, authorID, topic: category.name, lessonsCount };
        res.json(responseSubject);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a tantárgy részleteinek lekérdezése közben!' });
    }
});

router.get('/getAllSubjects', async (req, res) => {
    try {
        const { page = 1, pageSize = 3, topic } = req.query;
        const query = topic ? { topic: topic } : {};
        const totalCount = await SubjectModel.countDocuments(query);
        const maxPage = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const subjects = await SubjectModel.find(query, '_id name description author authorID topic urlSlug')
            .skip(skip)
            .limit(parseInt(pageSize));
        const allSubjects = await Promise.all(subjects.map(async (subject) => {
            const { _id, name, description, author, authorID, topic, urlSlug } = subject;
            const category = await SubjectTopicModel.findById(topic, 'name');
            return { _id, name, description, author, authorID, topic: category.name, urlSlug };
        }));  
        res.json({ totalCount, maxPage, subjects: allSubjects });
    } catch (error) {
        res.status(500).json({ error: 'Hiba az összes tantárgy lekérdezése közben!' });
    }
});

router.post('/subscribe/:urlSlug', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Érvénytelen token!' });
      }
      const userId = info.id;
      const { urlSlug } = req.params;
      try {
        const subject = await SubjectModel.findOne({ urlSlug });
        if (!subject) {
          return res.status(404).json({ error: 'A tantárgy nem található!' });
        }  
        const existingSubscription = await SubscriptionModel.findOne({
          userId,
          subjectId: subject._id,
        });
        if (existingSubscription) {
          return res.status(409).json({ error: 'Már feliratkoztál erre a tantárgyra!' });
        }
        const subscription = new SubscriptionModel({
          userId,
          subjectId: subject._id,
        });
        await subscription.save();
        const lessons = await LessonModel.find({ subjectID: subject._id });
        const lessonStatuses = lessons.map(lesson => ({
            lessonID: lesson._id,
            userID: userId,
            status: 0,
        }));
        await LessonStatusModel.create(lessonStatuses);
        res.json({ message: 'Sikeres feliratkozás!' });
      } catch (error) {
        res.status(500).json({ error: 'Hiba a feliratkozás során!' });
      }
    });
});

router.get('/getSubjectNames', async (req, res) => {
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
            const userSubscriptions = await SubscriptionModel.find({ userId }, 'subjectId');
            const subscribedSubjectIds = userSubscriptions.map(subscription => subscription.subjectId);
            const subjects = await SubjectModel.find({ _id: { $in: subscribedSubjectIds } }, 'name urlSlug');
            res.json(subjects);
        } catch (error) {
            res.status(500).json({ error: 'Hiba a tantárgyak lekérdezése közben!' });
        }
    });
});

router.delete('/deleteSubject/:id', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        }
        const userId = info.id;
        const { id } = req.params;
        try {
            const subscription = await SubscriptionModel.findOne({
                userId,
                subjectId: id,
            });
            if (!subscription) {
                return res.status(403).json({ error: 'Nincs feliratkozva erre a tantárgyra!' });
            }
            await LessonModel.deleteMany({ subjectID: id });
            await LessonStatusModel.deleteMany({ userID: userId });
            await SubscriptionModel.findByIdAndRemove(subscription._id);
            res.json({ message: 'A tantárgy sikeresen törölve lett a feliratkozások közül!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a tantárgy törlése közben!' });
        }
    });
});

router.put('/updateSubject/:id', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        }
        const userId = info.id;
        const { id } = req.params;
        const { name, description } = req.body;
        try {
            const subject = await SubjectModel.findOne({ _id: id, authorID: userId });
            if (!subject) {
                return res.status(403).json({ error: 'Nincs jogosultsága módosítani ezt a tantárgyat!' });
            }
            if (name !== undefined && name !== subject.name) {
                subject.name = name;
            }
            if (description !== undefined && description !== subject.description) {
                subject.description = description;
            }
            await subject.save();
            res.json({ message: 'A tantárgy sikeresen módosítva lett!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a tantárgy módosítása közben!' });
        }
    });
});

module.exports = router;