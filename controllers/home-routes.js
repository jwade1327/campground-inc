const router = require('express').Router();
const { User, Post, Comment } = require('../models');

// View all posts on campgrounds
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      'post_body',
      'created_at'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at'
        ],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(data => {
      const posts = data.map(post => post.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// single post with the comments
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'post_body',
      'created_at',
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at'
        ],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(data => {
      if (!data) {
        res.status(404).json({ message: 'No post under this id number!' });
        return;
      }
      const post = data.get({ plain: true });

      res.render('individual-post', { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// signup page 
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;