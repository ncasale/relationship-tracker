var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    descriptions: [{text: String, userId: {type: Schema.Types.ObjectId, ref: 'Users'}}],
    causes: [{text: String, userId: {type: Schema.Types.ObjectId, ref: 'Users'}}],
    resolutions: [{text: String, userId: {type: Schema.Types.ObjectId, ref: 'Users'}}],
    fightDate: {type: Date, default: Date.now},   
    relationshipId: {type: Schema.Types.ObjectId, ref: 'Relationships'},
    createUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    createTimestamp: {type: Date, default: Date.now},
    editTimestamp: {type: Date},
    editUserId: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Fights', schema);