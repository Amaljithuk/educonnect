const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

const app = express();
const db = new sqlite3.Database('educonnect.db');  // Change to file-based DB

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Add JSON body parser

// Create tables if they don't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, class TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, classes TEXT, subject TEXT, youtube TEXT, session_time TEXT, meet_link TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, teacher_id INTEGER, FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(teacher_id) REFERENCES teachers(id))");
    db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, teacher_id INTEGER, rating INTEGER, comments TEXT, FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(teacher_id) REFERENCES teachers(id))");
});

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle student signup
app.post('/student_signup', (req, res) => {
    const { name, email, password, class: studentClass } = req.body;

    db.run("INSERT INTO students (name, email, password, class) VALUES (?, ?, ?, ?)", [name, email, password, studentClass], function(err) {
        if (err) {
            return res.status(500).send("Error saving data");
        }
        res.send("Signup successful!");
    });
});

// Handle teacher signup
app.post('/teacher_signup', (req, res) => {
    const { name, email, password, classes, subject, youtube } = req.body;

    db.run("INSERT INTO teachers (name, email, password, classes, subject, youtube) VALUES (?, ?, ?, ?, ?, ?)", [name, email, password, classes.join(','), subject, youtube], function(err) {
        if (err) {
            return res.status(500).send("Error saving data");
        }
        res.send("Signup successful!");
    });
});

// Handle student login
app.post('/student_login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM students WHERE email = ? AND password = ?", [email, password], function(err, row) {
        if (err) {
            return res.status(500).send("Error logging in");
        }
        if (row) {
            res.redirect('student_dashboard.html');
        } else {
            res.send("Invalid email or password");
        }
    });
});

// Handle teacher login
app.post('/teacher_login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM teachers WHERE email = ? AND password = ?", [email, password], function(err, row) {
        if (err) {
            return res.status(500).send("Error logging in");
        }
        if (row) {
            res.redirect('teacher_dashboard.html');
        } else {
            res.send("Invalid email or password");
        }
    });
});

// Handle session update
// Handle session update using teacher ID from request
app.post('/update_session', (req, res) => {
    const { time, meetLink, 'teacher-id': teacherId } = req.body;

    if (!teacherId) {
        return res.status(400).send("Teacher ID is required");
    }

    db.run("UPDATE teachers SET session_time = ?, meet_link = ? WHERE id = ?", [time, meetLink, teacherId], function(err) {
        if (err) {
            return res.status(500).send("Error updating session details");
        }
        res.send("Session details updated successfully!");
    });
});

// Fetch enrolled students
app.get('/enrolled_students', (req, res) => {
    const teacherId = 1; // Replace with actual teacher ID from session or request

    db.all("SELECT students.name, students.email FROM students JOIN enrollments ON students.id = enrollments.student_id WHERE enrollments.teacher_id = ?", [teacherId], function(err, rows) {
        if (err) {
            return res.status(500).send("Error fetching enrolled students");
        }
        res.json(rows);
    });
});

// Fetch available subjects
app.get('/available_subjects', (req, res) => {
    db.all("SELECT DISTINCT subject FROM teachers", function(err, rows) {
        if (err) {
            return res.status(500).send("Error fetching subjects");
        }
        res.json(rows.map(row => row.subject));
    });
});

// Fetch teachers for a subject
app.get('/teachers', (req, res) => {
    const { subject } = req.query;
    const studentClass = 1; // Replace with actual student class from session or request

    db.all("SELECT * FROM teachers WHERE subject = ? AND classes LIKE ?", [subject, `%${studentClass}%`], function(err, rows) {
        if (err) {
            return res.status(500).send("Error fetching teachers");
        }
        res.json(rows);
    });
});

// Handle enrollment
app.post('/enroll', (req, res) => {
    const { teacherId } = req.body;
    const studentId = 1; // Replace with actual student ID from session or request

    db.run("INSERT INTO enrollments (student_id, teacher_id) VALUES (?, ?)", [studentId, teacherId], function(err) {
        if (err) {
            return res.status(500).send("Error enrolling in class");
        }
        res.send("Enrollment successful!");
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});