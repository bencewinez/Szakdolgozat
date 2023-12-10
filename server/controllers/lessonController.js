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

router.post('/createLesson/:subjectUrlSlug', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, userInfo) => {
      if (err) {
        return res.status(401).json({ error: 'Érvénytelen token!' });
      }
      const userId = userInfo.id;
      const { subjectUrlSlug } = req.params;
      const { lessonName, lessonReleaseDate, value } = req.body;
      try { 
        const subject = await SubjectModel.findOne({ urlSlug: subjectUrlSlug, authorID: userId });
        if (!subject) {
          return res.status(404).json({ error: 'Nincs jogosultsága létrehozni ezt a leckét ehhez a tantárgyhoz!' });
        }
        const currentDate = new Date();
        const lessonDate = new Date(lessonReleaseDate); 
        if (lessonDate < currentDate) {
          return res.status(400).json({ error: 'A lecke megjelenési dátuma nem lehet a jelenlegi időpont előtt!' });
        }
        if (!value.trim()) {
          return res.status(400).json({ error: 'A lecke tartalma nem lehet üres!' });
        }
        const lessonUrlSlug = `${subjectUrlSlug}_${lessonName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase()}`;
        const existingLesson = await LessonModel.findOne({
            lUrlSlug: lessonUrlSlug
        });
        if (existingLesson) {
            return res.status(400).json({ error: 'Ez a lecke név már létezik!' });
        }
        const newLesson = new LessonModel({
          name: lessonName,
          subjectID: subject._id,
          authorID: userId,
          lUrlSlug: lessonUrlSlug,
          releaseDate: lessonReleaseDate,
          content: value,
        });
        await newLesson.save();
        const subscribers = await SubscriptionModel.find({ subjectId: subject._id });
        const newLessonStatuses = await Promise.all(subscribers.map(async (subscriber) => {
            const user = await User.findById(subscriber.userId);
            return {
                lessonID: newLesson._id,
                userID: user._id,
                status: 0,
            };
        }));
        await LessonStatusModel.create(newLessonStatuses);
        subject.lessonsCount += 1;
        await subject.save();
        res.json({ lessonID: newLesson._id, message: 'A lecke sikeresen létrehozva!' });
      } catch (error) {
        console.error('Hiba történt a lecke létrehozása során:', error);
        res.status(500).json({ error: 'Hiba történt a lecke létrehozása során!' });
      }
    });
});

const formatReleaseDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
};

router.get('/getLesson/:lUrlSlug', async (req, res) => {
    try {
        const { lUrlSlug } = req.params;
        const lesson = await LessonModel.findOne({ lUrlSlug });
        if (!lesson) {
            return res.status(404).json({ error: 'Hiba a lecke lekérdezése közben!' });
        }
        const subject = await SubjectModel.findById(lesson.subjectID, 'name');
        const author = await User.findById(lesson.authorID, 'name');
        const lessonData = {
            _id: lesson._id,
            name: lesson.name,
            subjectName: subject.name,
            authorName: author.name,
            releaseDate: formatReleaseDate(lesson.releaseDate),
            content: lesson.content,
            lUrlSlug: lesson.lUrlSlug,
        };
        res.json(lessonData);
    } catch (error) {
        console.error('Hiba történt a lecke létrehozása során:', error);
        res.status(500).json({ error: 'Hiba történt a lecke létrehozása során!' });
    }
});

router.get('/getLessons/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params;
        const lessons = await LessonModel.find({ subjectID: subjectId }, '_id name authorID authorName releaseDate lUrlSlug');
        const formattedLessons = lessons.map((lesson) => ({
            _id: lesson._id,
            name: lesson.name,
            authorID: lesson.authorID,
            authorName: lesson.authorName,
            releaseDate: formatReleaseDate(lesson.releaseDate),
            lUrlSlug: lesson.lUrlSlug,
        }));
        res.json(formattedLessons);
    } catch (error) {
        console.error('Hiba történt a leckék létrehozása során:', error);
        res.status(500).json({ error: 'Hiba történt a leckék létrehozása során!' });
    }
});

router.get('/getLessonStatus/:userId/:lessonId', async (req, res) => {
    try {
        const { userId, lessonId } = req.params;
        const lessonStatus = await LessonStatusModel.findOne({ userID: userId, lessonID: lessonId });

        res.json({ status: lessonStatus ? lessonStatus.status : null });
    } catch (error) {
        console.error('Hiba történt a lecke státusz lekérdezése során:', error);
        res.status(500).json({ error: 'Hiba történt a lecke státusz lekérdezése során!' });
    }
});

router.post('/updateLessonStatus/:userId/:lessonId', async (req, res) => {
    try {
        const { userId, lessonId } = req.params;
        const { newStatus } = req.body;
        if (!userId || !lessonId) {
            return res.status(400).json({ error: 'Hiányzó userId vagy lessonId!' });
        }
        const lessonStatus = await LessonStatusModel.findOne({ userID: userId, lessonID: lessonId });
        if (lessonStatus) {
            if (lessonStatus.status === 0 && newStatus === 1) {
                lessonStatus.status = newStatus;
                await lessonStatus.save();
                return res.json({ message: 'Sikeres státusz frissítés!' });
            } else if (lessonStatus.status === 1 && newStatus === 2) {
                lessonStatus.status = newStatus;
                await lessonStatus.save();
                return res.json({ message: 'Sikeres státusz frissítés!' });
            } else {
                return res.json({ message: 'Nincs változás a státuszban.' });
            }
        }
    } catch (error) {
        console.error('Hiba történt a státusz frissítése során:', error);
        res.status(500).json({ error: 'Hiba történt a státusz frissítése során!' });
    }
});

router.delete('/deleteLesson/:lessonId', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Nincs érvényes token!' });
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Érvénytelen token!' });
        }
        const userId = info.id;
        const { lessonId } = req.params;
        try {
            const lesson = await LessonModel.findById(lessonId);
            if (!lesson) {
                return res.status(404).json({ error: 'A lecke nem található!' });
            }
            if (lesson.authorID.toString() !== userId) {
                return res.status(403).json({ error: 'Nincs jogosultsága törölni ezt a leckét!' });
            }
            const subject = await SubjectModel.findById(lesson.subjectID);
            if (!subject) {
                return res.status(404).json({ error: 'A tantárgy nem található!' });
            }
            if (subject.lessonsCount > 0) {
                await SubjectModel.findByIdAndUpdate(lesson.subjectID, { $inc: { lessonsCount: -1 } });
            }
            await LessonStatusModel.deleteMany({ lessonID: lessonId });
            await LessonModel.findByIdAndRemove(lessonId);
            res.json({ message: 'A lecke sikeresen törölve lett!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a lecke törlése közben!' });
        }
    });
});

module.exports = router;