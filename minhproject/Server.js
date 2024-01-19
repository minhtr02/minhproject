const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');


const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const root = { root: '.' }

app.get('/', (req, res) => {
    res.sendFile('public/index.html', root)
});

app.get('/login', (req, res) => {
    res.sendFile('public/login.html', root)
});

app.get('/register', (req, res) => {
    res.sendFile('public/register.html', root)
});

app.get('/all/courses', (req, res) => {
    res.sendFile('public/allcourses.html', root)
});

app.get('/my/courses', (req, res) => {
    res.sendFile('public/mycourses.html', root)
});

app.get('/course/:courseid/quizes', (req, res) => {
    res.cookie('course_id', req.params.courseid)
    res.sendFile('public/coursepage.html', root)
});


app.get('/api/annoucements', (req,res) => {
    db.all(`SELECT * FROM announcements`, (err, annoucements) => {
        res.json(annoucements)
    })
})
app.get('/api/all/courses', (req,res) => {
    db.all(`SELECT * FROM courses WHERE id NOT IN (SELECT course_id FROM student_courses WHERE student_id = ?)`, req.cookies.student_id , (err, courses) => {
        
        res.json(courses)
    })
})

app.get('/api/my/courses', (req,res) => {
    db.all(`SELECT * FROM courses WHERE id IN (SELECT course_id FROM student_courses WHERE student_id = ?)`, req.cookies.student_id , (err, courses) => {
        
        res.json(courses)
    })
})
app.post('/api/login', (req,res) => {
    console.log(req.body)
    db.get(`SELECT * FROM student WHERE student_name = ?`, req.body.student_name , (err, student) => {
        if (!student) {
            res.json('Student Name do not exist')
        }
        else {
            if(student.password != req.body.password ) {
                res.json('Wrong password, please re-enter')
            }
            else {
                res.cookie('student_id', student.id)
                res.cookie('student_name', student.student_name)
                res.json('Login Success')
            }
        }
    })
})

app.post('/api/register', (req,res) => {
    db.run(`INSERT INTO student(student_name, password) VALUES(?, ?)`,[req.body.student_name, req.body.password], (err) => {
        if(err) {
            res.json('Student name already exists, please change it')
        }
        else {
            res.json('Sign Up Success')
        }
    })
})
app.post('/api/all/courses/enroll', (req,res) => {
    db.run(`INSERT INTO student_courses(course_id, student_id) VALUES(?, ?)`,[req.body.course_id, req.cookies.student_id], (err) => {
        if(err) {
            console.log(err)
        }
        else {
            res.json('Enrolled')
        }
    })
})
app.post('/api/my/courses/unenroll', (req,res) => {
    db.run(`DELETE FROM student_courses WHERE course_id = ? AND student_id = ?`,[req.body.course_id, req.cookies.student_id], (err) => {
        if(err) {
            console.log(err)
        }
        else {
            res.json('Leave course success')
        }
    })
})

app.get('/api/course/:courseid/quizes', (req,res) => {

    db.all(`SELECT * FROM quiz_course WHERE course_id = ?`,req.cookies.course_id, (err, quizes) => {
        if(err) {
            console.log(err)
        }
        else {
            res.json(quizes)
        }
    })
})

app.post('/api/course/:courseid/doquiz/:quizid', (req,res) => {

    db.all(`SELECT * FROM question_quiz WHERE quiz_id = ?`,req.cookies.quiz_id, (err, questions) => {
        if(err) {
            console.log(err)
        }
        else {
            questions.forEach(q => {
                q.choices = JSON.parse(q.choices)
            })
            res.json(questions)
        }
    })
})

app.post('/api/logout', (req,res) => {
    console.log('b')
    res.clearCookie('student_id')
    res.clearCookie('course_id')
    res.clearCookie('student_name')
    res.clearCookie('quiz_id')
    res.json('Logout')
})
app.listen(3000)