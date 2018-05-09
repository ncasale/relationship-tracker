var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var Message = require('./message').schema


var schema = new Schema({
    users: {type: [Schema.Types.ObjectId], ref: 'Users'},
    invitees: {type: [Schema.Types.ObjectId], ref: 'Users'},
    title: {type: String, required: true},
    createTimestamp: {type: Date, default: Date.now()},
    isPlatonic: {type: Boolean, default: false}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Relationships', schema);