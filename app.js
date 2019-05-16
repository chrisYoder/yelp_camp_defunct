const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Campground            = require('./models/campgroundModel'),
      Comment               = require('./models/commentModel'),
      User                  = require('./models/userModel'),
      flash                 = require('connect-flash'),
      methodOverride        = require('method-override');
    //   seedDB                = require('./seeds');
      
      
// requiring routes 
const campgroundRoutes      = require('./routes/campgrounds'),
      commentRoutes         = require('./routes/comments'),
      indexRoutes           = require('./routes/index');
      

   
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true} );
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// seedDB();

app.use(flash());
// Passport config
app.use(require('express-session')({
    secret: 'The most important step is the next one',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_method'));


app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.moment = require('moment');
  next();
});

app.get('', (req, res) => {
  res.render('campgrounds/landing');
});



app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);




app.listen(process.env.PORT, process.env.IP, () => console.log('Yelp Camp is running'));
