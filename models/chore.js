var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    dueDate: {type: Date, default: Date.now, required: true},
    assignedUserId: {type: Schema.Types.ObjectId, ref: 'Users', required: true},        
    relationshipId: {type: Schema.Types.ObjectId, ref: 'Relationships'},
    createUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    createTimestamp: {type: Date, default: Date.now},
    editTimestamp: {type: Date},
    editUserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Chores', schema);