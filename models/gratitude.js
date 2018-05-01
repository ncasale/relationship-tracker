var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},       
    relationshipId: {type: Schema.Types.ObjectId, ref: 'Relationships'},
    createUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    createTimestamp: {type: Date, default: Date.now},
    editTimestamp: {type: Date},
    editUserId: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Gratitudes', schema);