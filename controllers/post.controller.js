const PostModel = require('../models/post.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get post : ' + err);
    }).sort({ createdAt: -1 });

}

module.exports.postInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    PostModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID not found : ' + err)
    });
}

module.exports.createPost = async (req, res) => {
    if (req.file !== null) {
        const newPost = new PostModel(req.body);

        if (req.file){
            newPost.picture = req.file.path.split("uploads/").pop();
        }

        try {
            const post = await newPost.save();
            return res.status(201).json(post);
        }
        catch (err) {
            return res.status(400).send(err);
        }
    }
}

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    const updatedRecord = {
        title: req.body.title,
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update post error : " + err);
        }
    )
}

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Delete post error : " + err);
        }
    )

}

