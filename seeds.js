const mongoose = require('mongoose');
const Campground = require('./models/campgroundModel');
const Comment = require('./models/commentModel');

const data = [
    { 
        name: 'Clouds rest', 
        image: 'https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg',
        description: 'Value-added game-plan gain alignment quick win we need to have a Come to Jesus meeting with Phil about his attitude. Pixel pushing streamline, for teams were able to drive adoption and awareness timeframe, nor accountable talk. Pig in a python re-inventing the wheel. Circle back powerPointless accountable talk so please use "solutionise" instead of solution ideas! :) net net, closing these latest prospects is like putting socks on an octopus. Quantity we need distributors to evangelize the new line to local markets products need full resourcing and support from a cross-functional team in order to be built, maintained, and evolved for productize, and time vampire yet win-win gain traction. ',
    },
    { 
        name: 'Desert Mesa', 
        image: 'https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg',
        description: 'Can you make the logo bigger yes bigger bigger still the logo is too big can it be more retro low resolution? It looks ok on my screen, so will royalties in the company do instead of cash so this looks perfect. Just Photoshop out the dog, add a baby, and make the curtains blue. I want you to take it to the next level will royalties in the company do instead of cash. I want you to take it to the next level can the black be darker nor can you pimp this powerpoint, need more geometry patterns concept is bang on, but can we look at a better execution that sandwich needs to be more playful, can you make the blue bluer? so you can get my logo from facebook. Can you put "find us on facebook" by the facebook logo? doing some work for us "pro bono" will really add to your portfolio i promise. We try your eye, but can you change everything? this was not according to brief the hair is just too polarising.', 
    },
    { 
        name: 'Canyon Floor', 
        image: 'https://farm6.staticflickr.com/5573/18831681146_c309467e2f.jpg',
        description: 'Cillum veritatis cupidatat. Commodo nemo so natus nulla autem doloremque or sunt. Incididunt omnis, for consequatur sit. Voluptatem id nor dicta. Aperiam commodo yet exercitationem but eaque esse proident. Reprehenderit natus. Quo. Consequatur velit. Adipisicing autem. Eum ipsum dolor so ab duis or qui. Labore. Sunt in nor dolorem nor si explicabo. Aspernatur molestiae or quasi. '
    },
];



const seedDB = () => {
  // remove all campgrounds
  Campground.deleteMany({}, (err) => {
    if(err) {
      console.log(err);
    }
    // add a few campgounds
    data.forEach( seed => {
      Campground.create(seed, (err, campground) => {
        if(err){
          console.log(err);
        } else {
          console.log('added campground');
          // create comment
          Comment.create(
            {
              text: 'This place is great', 
              author: 'Homer'
            }, (err, comment) => {
              if(err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log('created new comment');
              }
          });
        }
      });  
    });
  }); 
    
    
    
};

module.exports = seedDB;