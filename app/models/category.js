// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  
  	name: {
    	unique: true,
    	index: true,
    	type: String
  	},
  	updated_time: {
      index: true,
    	type: Date, default: Date.now
  	},
    duration: Number,
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
},{
    timestamps: true
});


mongoose.model('Category', CategorySchema);

