
const mongose = require('mongoose');
const Schema = mongose.Schema;

const TaskSchema = new Schema({
    content : {
        type : String,
        required : true
    }
}, { timestamps : true });

const Task = mongose.model('Task', TaskSchema );

module.exports = Task;