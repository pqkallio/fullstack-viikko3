const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const dbUri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ds161092.mlab.com:61092/fullstack-puhelinluettelo`

mongoose.connect(dbUri)

const personSchema = new Schema({
    name: String,
    number: String
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