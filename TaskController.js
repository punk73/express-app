const Task = require('./models/Task');

class TaskController {
    get(req, res) {
        Task.find().then((data) => {

            res.send({
                success : true,
                message : 'data found',
                data : data
            })
        }).catch(err => {
            res.send({
                success :false,
                'message' : err
            })
        })

    }

    post(req, res) {
        const body = req.body;

        const task = new Task({content: body.content})
        task.save()
        .then(() => {
            res.send({
                success : true,
                data : task
            })
        }).catch(err => {
            console.log(err)
            res.send({
                success : false,
                error : err
            })
        })

    }

    put(req, res) {
        const id = req.params.id;
        const content = req.body.content;

        Task.findById(id).then(result => {
            result.content = content;
            result.save();
            res.send({
                success: true,
                'message': 'data updated!',
                data : result
            });
            
        }).catch(err => {
            res.send({
                success : false,
                error : err
            });
        })

        
    }

    delete(req, res) {
        const id = req.params.id;
        console.log(id)
        Task.findByIdAndDelete(id).then(result => {
            res.send({
                success: true,
                'message': `data ${id} deleted!`
            });
        }).catch(err => {
            console.log(err)
            res.status(401).send({
                success : false,
                message : err
            })
        })

        
    }
}

module.exports = new TaskController();
