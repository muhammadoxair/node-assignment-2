const express = require('express');
const router = express.Router()

//Login Method
router.post('/login', (req, res) => {
    res.send('Login API')
})

//Register Method
router.post('/register', (req, res) => {
    res.send('Register API')
})

//Update Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})


module.exports = router;
