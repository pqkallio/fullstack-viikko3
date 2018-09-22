const mongoose = require('mongoose')
const Schema = mongoose.Schema;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const dbUrl = process.env.MONGODB_URI

mongoose.connect(dbUrl)

const personSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'The name must be unique.'],
        required: [true, 'Name required.']
    },
    number: {
        type: String,
        required: [true, 'Number required.']
    }
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person