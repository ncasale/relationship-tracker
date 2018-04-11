var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    text: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    relationshipId: {type: Schema.Types.ObjectId, ref: 'Relationships'},
    firstname: {type: String},
    lastname: {type: String},
    createTimestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Messages', schema);