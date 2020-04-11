const Joi = require('joi'); // return from this model as a class, so J is capital
const express = require('express');
const app = express();

app.use(express.json());

// CRUD operation through HTTP ===========================
// app.get()
// app.post()
// app.put()
// app.delete()

// Handling GET requests
const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' },
];

app.get('/', (req, res) => {
    res.send('Hello Bangladesh!');
});

app.get('/api/courses', (req, res) => {
    // res.send([1, 2, 3]);
    res.send(courses);
});

// Route parameter for single course
app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params);
    // res.send(req.params.id);

    // Handling GET requests (if exists ID or not)
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course id was not found');
    res.send(course);
});

// Multiple route parameters 
app.get('/api/posts/:year/:month/:day', (req, res) => {
    res.send(req.params); // http://localhost:3000/api/posts/2020/5/15 (for example)
   
    // Query parameter on route ========= 
    // res.send(req.query); // http://localhost:3000/api/posts/2020/5/15?sortBy=name (for example)
});

// Handling POST Requests ====================
app.post('/api/courses', (req, res) => {
    // Input Validation under Joi npm package ==============
    // const shcema = {
    //     name: Joi.string().min(3).max(30).required()
    // };
    // const result = Joi.validate(req.body, shcema);
    // console.log(result);
    // if (result.error) {
    //     res.status(400).send(result.error.details[0].message); // .details[0] is for exact message to the client
    //     return;
    // };

    // Validation through validateCourse function ==========
    const { error } = validateCourse(req.body); // result.error (object destructor)
    if (error) return res.status(400).send(error.details[0].message); // .details[0] is for exact message to the client

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course); 
});

// Handling PUT request / UPDATE the courses
app.put('/api/courses/:id', (req, res) => {
    // Here 3 tasks ==============
    // 1. Look up the course and if doesn't exist, return 404 not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course id was not found');

    // 2. Validation the course and return Bad request ===========
    // const shcema = {
    //     name: Joi.string().min(3).max(30).required()
    // };

    // const result = Joi.validate(req.body, shcema);    
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // result.error (object destructor)
    if (error) return res.status(400).send(error.details[0].message); // .details[0] is for exact message to the client

    // 3. Update the course and return
    course.name = req.body.name;
    res.send(course);

});

// Handling DELETE request
app.delete('/api/courses/:id', (req, res) => {
    // Here 3 tasks ==============
    // 1. Look up the course and if doesn't exist, return 404 not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course id was not found');

    // 2. Delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // 3. Return the same course
    res.send(course);
});

// Create a function validateCourse for app.put/.post/.delete
function validateCourse(course) {
    const shcema = {
        name: Joi.string().min(3).max(30).required()
    };
    return Joi.validate(course, shcema);
}

// PORT environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
