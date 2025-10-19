const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const ImageSchema=new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});

const opts = { toJSON: { virtuals: true } };


const MatchSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }}, opts); 


MatchSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/Matches/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});




MatchSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
})
module.exports = mongoose.model('Match', MatchSchema);





