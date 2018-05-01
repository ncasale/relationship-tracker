var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},       
    createUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    createTimestamp: {type: Date, default: Date.now},
    closed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Feedback', schema);