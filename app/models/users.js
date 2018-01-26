// Example model

var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var UsersSchema = new Schema({
    type: String,
    email: String,
    password: String,
   
    name: {
        unique: true,
        index: true,
        type: String
    },
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
},{
    timestamps: true
});

mongoose.model('Users', UsersSchema);

