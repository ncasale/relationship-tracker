var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    relationships: [{type: Schema.Types.ObjectId, ref: 'Relationship'}],
    invites: [{type: Schema.Types.ObjectId, ref: 'Relationship'}],
    createTimestamp: {type: Date, default: Date.now()},
    searchStr: {type: String, default: ''}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
