var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Admins', schema);