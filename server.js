const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Task = require('./models/Task')

const app = express()
const port = 5000

dotenv.config()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/taskTracker')
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log(error))

app.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body)
        const task = await newTask.save()
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            res.status(404).json({ error: "Here is the message" })
        }

        res.status(200).json(task)
    } catch (error) {
        res.status(500).json(error)
    }
})
app.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).json({ error: "Here is the message" })
        }

        res.status(200).json("the task is deleted successfuly")
    } catch (error) {
        res.status(500).json(error)
    }
})


app.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`The server is running on localhost://${port}`);
})