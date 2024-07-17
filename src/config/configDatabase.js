const mongoose = require('mongoose');
require('../models/user')
require('../models/Recepies') 


const connectionString = 'mongodb://127.0.0.1:27017/HomeCookingRecipes'

async function configDatabase() {




    await mongoose.connect(connectionString, {

        useUnifiedTopology: true
    });
    console.log('database connected');
}
module.exports = { configDatabase }