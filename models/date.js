var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    location: {type: String, required: true},
    hour: {type: String, required: true},
    minute: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true},        
    relationshipId: {type: Schema.Types.ObjectId, ref: 'Relationships'},
    createUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    createTimestamp: {type: Date, default: Date.now},
    editTimestamp: {type: Date},
    editUserId: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Dates', schema);