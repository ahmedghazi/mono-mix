// Example model

var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var AttachmentsSchema = new Schema({
	date_created: {
        index: true,
        type: Date, default: Date.now
    },
    originalname: String,
    mimetype: String,
    filename: String,
    large: String,
	thumbnail: String,
	path: String,
	size: Number,
    title: String,
    texte: String
},{
    timestamps: true
});



mongoose.model('Attachments', AttachmentsSchema);

