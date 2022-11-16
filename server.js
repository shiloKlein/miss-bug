const express = require('express')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const bugService = require('./services/bug.service.js')
const pdfService = require('./services/pdf.service.js')
const userService = require('./services/user.service.js')

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// LIST

app.get('/api/bug/', (req, res) => {
    const { title, page } = req.query
    const filterBy = {
        title: title || '',
        page: +page || 0
    }
    console.log('as;dlkas;ldk')

    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
})

// ADD
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    // console.log('params', req.query);
    const { title, description, severity, createdAt } = req.body
    const bug = {
        title,
        description,
        severity,
        createdAt,
        creator: loggedinUser
    }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot save bug')
        })
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')
    const { title, description, severity, createdAt, creator } = req.body
    console.log('creator', creator);
    if (loggedinUser._id !== creator._id && !loggedinUser.isAdmin) {
        console.log('cant cant');
        return res.status(401).send('you are not the bug owner')
    }
    const bug = {
        title,
        description,
        severity,
        createdAt
    }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => console.log)
})


app.get('/api/bug/:bugId', (req, res) => {
    // console.log('params', req.params);
    const { bugId } = req.params
    var visitedCount = req.cookies.visitedCount || []
    if (!visitedCount.includes(bugId)) visitedCount.push(bugId)
    if (visitedCount.length > 3) return res.status(401).send('wait for a bit')

    if (visitedCount.length === 3) {
        console.log(visitedCount.length);
        res.cookie('visitedCount', visitedCount, { maxAge: 7000, httpOnly: true })
    } else res.cookie('visitedCount', visitedCount)

    // res.cookie('visitedCount', visitedCount)

    bugService.getById(bugId)
        .then(bug => {

            // console.log('bug', bug);
            res.send(bug)
        })
        .catch(err => console.log)
})


// USERS

// list
app.get('/api/users/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if(!loggedinUser.isAdmin)return res.status(401).send('Only Admins area')
    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(console.log)
})

// login
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body).then(user => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else {
            res.status(401).send('Invalid login')
        }
    })
        .catch(err => console.log)
})

// sign up
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => console.log)
})

// log out

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})



// PDF
app.post('/api/bug/pdf', (req, res) => {
    const bugs = req.body
    console.log('pdf', bugs);
    pdfService.makeBugsPdf(bugs)
    res.send('./pdf/bugs.pdf')
})

// DELETE
app.delete('/api/bug/:bugId/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            if (loggedinUser._id !== bug.creator._id &&
                !loggedinUser.isAdmin ||
                 !bug.creator._id)
                return res.status(401).send('you are not the bug owner')

            console.log('why are you here dude???');
            const { bugId } = req.params
            bugService.remove(bugId)
                .then(() => {
                    res.send('Removed!')
                })
        })
        .catch(err => console.log)
})


// pdf
const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)