const express = require('express');

const router = express.Router();
const Post = require('../models/Post');


//Routes
router.get('' , async(req,res)=> {
    
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort : {createdAt : -1} } ])
        .skip(perPage*page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index',{
            locals ,
            data,
            current : page,
            nextPage : hasNextPage ? nextPage:null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
});

// get blogs by id

router.get('/post/:id' , async(req,res)=> {
    
    try {
        let slug = req.params.id;

        const data = await Post.findById({_id : slug});
        
        const locals = {
            title : data.title,
            description : "Simple Blog Created by NodeJs, Express and MongoDb."
        }
        
        res.render('post' , {locals , data , currentRoute: `/post/${slug}`});

    } catch (error) {
        console.log(error);
    }
})

//post route for posting search term

router.post('/search' , async(req,res) => {
    
    try {
        const locals = {
            title : "NodeJs Blog",
            description : "Simple Blog created with NodeJs, express and MongoDb"
        }

        let searchTerm = req.body.searchTerm;

        const searchNoSpecialchar = searchTerm.replace(/[^a-zA-Z0-9]/g , "")
        const data = await Post.find({
            $or: [
                {title : {$regex: newRegExp(searchNoSpecialchar , 'i')}},
                {body : {$regex: newRegExp(searchNoSpecialchar , 'i')}}
            ]
        });

        res.render('searcher',{
            data,
            locals,
            currentRoute: '/'
        })

    } catch (error) {
        console.log(error);
    }
})

router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
});



module.exports = router;


// function insertPostdata() {
//     POST.insertMany([
//         {
//             title: "first blog",
//             body: "this is first blog body"
//         },
//         {
//             title: "second blog",
//             body: "this is seconmd blog body"
//         },
//         {
//             title: "third blog",
//             body: "this is third blog body"
//         },
//         {
//             title: "fourth blog",
//             body: "this is fourth blog body"
//         },
//         {
//             title: "fifth blog",
//             body: "this is fifth blog body"
//         },
//     ])
// }
// insertPostdata()