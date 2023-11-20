const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const SubjectTopic = require('./models/SubjectTopics');
const SubjectTopicModel = require('./models/SubjectTopics');
const SubjectModel = require('./models/Subject');
const SubscriptionModel = require('./models/Subscription');

const salt = bcrypt.genSaltSync(10);
const secret = 'fmsdazgh4245dashd83242dyid';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://pinterbence5:EduSzakdoga2023@eduszakdoga.b4zeaqb.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
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
});

app.get('/userProfile', async (req, res) => {
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

app.post('/changePassword', async (req, res) => {
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

app.post('/changeData', async (req, res) => {
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

app.post('/deleteProfile', async (req, res) => {
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
            const userDoc = await User.findById(userId);
            if (!userDoc) {
                return res.status(404).json({ error: 'A felhasználó nem található meg!' });
            }
            await User.findByIdAndRemove(userId);
            res.clearCookie('token');
            res.json({ message: 'A profil sikeresen törölve lett!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a profil törlése közben!' });
        }
    });
});

app.get('/getSubjectTopics', async (req, res) => {
    try {
        const subjectTopics = await SubjectTopicModel.find({}, 'name');
        res.json(subjectTopics);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a Tantárgy Témakörök lekérdezése közben!' });
    }
});

app.post('/addSubject', async (req, res) => {
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

app.get('/getMySubjects', async (req, res) => {
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

app.get('/getSubject/:urlSlug', async (req, res) => {
    try {
        const { urlSlug } = req.params;
        const subject = await SubjectModel.findOne({ urlSlug }, ' _id, name description author authorID topic');
        if (!subject) {
            return res.status(404).json({ error: 'A tantárgy nem található!' });
        }
        const { _id, name, description, author, authorID, topic } = subject;
        const category = await SubjectTopicModel.findById(topic, 'name');
        const responseSubject = { _id, name, description, author, authorID, topic: category.name };
        res.json(responseSubject);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a tantárgy részleteinek lekérdezése közben!' });
    }
});

app.get('/getAllSubjects', async (req, res) => {
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

app.post('/subscribe/:urlSlug', async (req, res) => {
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
        res.json({ message: 'Sikeres feliratkozás!' });
      } catch (error) {
        res.status(500).json({ error: 'Hiba a feliratkozás során!' });
      }
    });
});

app.get('/getSubjectNames', async (req, res) => {
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

app.delete('/deleteSubject/:id', async (req, res) => {
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
            await SubscriptionModel.findByIdAndRemove(subscription._id);
            res.json({ message: 'A tantárgy sikeresen törölve lett a feliratkozások közül!' });
        } catch (error) {
            return res.status(500).json({ error: 'Hiba a tantárgy törlése közben!' });
        }
    });
});

app.put('/updateSubject/:id', async (req, res) => {
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


const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});