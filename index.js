const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { id:1, name: 'Arto Hellas', number: '040-123456' },
    { id:2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id:3, name: 'Dan Abramov', number: '12-43-234345' },
    { id:4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    let person = persons.find(p => p.id )
    res.json(person)
})

app.delete('api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const generateId = () => Math.floor(Math.random()*Math.floor(999))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body || !body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const foundName = persons.find(p => p.name === body.name)
    if(foundName){
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    console.log(body);
    response.json(newPerson)
    persons.concat(newPerson)
  })

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people
    <br>
    ${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})