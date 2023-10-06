const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        titleFR: {
            type: String,
            trim: true,
            maxlenght: 100,
        },
        titleEN: {
            type: String,
            trim: true,
            maxlenght: 100,
        },
        messageFR: {
            type: String,
            trim: true,
            maxlenght: 500,
        },
        messageEN: {
            type: String,
            trim: true,
            maxlenght: 500,
        },
        picture: {
            type: String,
        },
        video: {
            type: String,
        }
    },
    {
        timestamps: true, // Créer automatiquement le createdAt et le updatedAt
    }
);


const PostModel = mongoose.model('post', PostSchema);
module.exports = PostModel;