const router = require('express').Router();
const { User, Post, Comment, Campground } = require('../../models');
const withAuth = require('../../utils/auth');


// retrieve all users in api/json
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/loggedin', (req, res) => {
    if (!req.session.user_id) {
        res.json({ loggedin: false })
      } else {
        res.json({ loggedin: true })
      }
});

// retrieve a user by id #
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: [
                    'id',
                    'title',
                    'post_body',
                    'created_at'
                ]
            },
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'created_at'
                ],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Campground,
                attributes: [
                    'campground_name',
                    'location',
                    'user_id'
                ]
            }
        ]
    })
    .then(data => {
        if (!data) {
            res.status(404).json({ message: 'Invalid id number!' });
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create user during signup
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(data => {
        req.session.save(() => {
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.loggedIn = true;

            res.json(data);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update user info
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data[0]) {
            res.status(404).json({ message: 'Invalid id number!' });
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete user
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({ message: 'Invalid id number!' });
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login route
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(data => {
        if (!data) {
            res.status(400).json({ message: 'Invalid username!' });
            return;
        }

        const validPassword = data.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Password is incorrect! Try again!' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.loggedIn = true;

            res.json({ user: data, message: 'Login Successful!' });
        });
    });
});

// logout route
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});


module.exports = router;