var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    users: {type: [Schema.Types.ObjectId], ref: 'Users'},
    invitees: {type: [Schema.Types.ObjectId], ref: 'Users'},
    title: {type: String, required: true},
    messages: {type: [String], ref: 'Messages'}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Relationships', schema);