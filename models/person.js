const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config();
const url = process.env.MONGODB_URI
// const url2='mongodb+srv://fullstack:fullstack13@cluster0.n98wd.mongodb.net/contacts?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, unique: true, required: true},
    number: {type: String, minlength: 8, required: true},
})
personSchema.plugin(uniqueValidator)
  
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Person', personSchema)