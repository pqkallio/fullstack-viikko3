const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

morgan.token('data', function(req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

app.use(bodyParser.json())

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`
                <div>
                    <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                    <p>${new Date()}</p>
                </div>`)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name must be given' })
    }

    if (body.number === undefined) {
        return res.status(400).json({ error: 'number must be given' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(() => {
            res.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'The name must be unique.' })
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'Malformatted id' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'Malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(() => {
            res.status(400).send({ error: 'Malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})