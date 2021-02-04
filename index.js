/* eslint-disable linebreak-style */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postToken'))

morgan.token('postToken', (req, res, param) => {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }
})

let persons = [
    { id:1, name: 'Arto Hellas', number: '040-123456' },
    { id:2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id:3, name: 'Dan Abramov', number: '12-43-234345' },
    { id:4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
    // console.log(req);
    // res.json(persons)
    Person.find({})
        .then(p => res.json(p))
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    // let person = persons.find(p => p.id )
    // res.json(person)
    Person.findById(id)
        .then(person => {
            person
                ? res.json(person)
                : res.status(404).end()
        })
        .catch(e=>next(e))
})

app.delete('api/persons/:id', (req, res) => {
    const id = req.params.id
    // persons = persons.filter(p => p.id !== id)
    // res.status(204).end()
    Person.findByIdAndRemove(id)
        .then(p => res.status(204).end())
        .catch(e => next(e))

})

const generateId = () => Math.floor(Math.random()*Math.floor(999))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body || !body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // const foundName = persons.find(p => p.name === body.name)
    // if(foundName){
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }

    // const newPerson = {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number
    // }
    // console.log(body);
    // response.json(newPerson)
    // persons.concat(newPerson)
    const person = new Person({
        name: body.name,
        number: body.number
    })
    //promise chain clearing
    // person.save()
    //   .then(savedP => {
    //   res.json(savedP)
    // })
    //   .catch(e => next(e))
    person
        .save()
        .then( savedP => savedP.toJSON())
        .then( savedAndFormattedP => {
            res.json(savedAndFormattedP)
        })
        .catch(e => next(e))
    
})

app.get('/info', (req, res) => {

    Person.find({})
        .then( persons => res.send(`Phonebook has info for ${persons.length} people <br/
        ${Date()}>`))

    // res.send(`Phonebook has info for ${persons.length} people
    // <br>
    // ${new Date()}`)
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = new Person({
        name: body.name,
        number: body.number
    })
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})