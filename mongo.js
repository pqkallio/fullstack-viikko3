const mongoose = require('mongoose')
const db_url = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ds161092.mlab.com:61092/fullstack-puhelinluettelo`

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length === 4) {
    mongoose.connect(db_url)
    console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(() => {
            console.log('lisätty onnistuneesti!')
            mongoose.connection.close()
        })
} else if (process.argv.length === 2) {
    mongoose.connect(db_url)
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
} else {
    console.log('komentoriviargumentteja saa olla joko 0 tai 2')
}