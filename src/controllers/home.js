const { Router } = require("express");
const { getRecent } = require("../services/recepy");


const homeRouter = Router()

homeRouter.get('/', async (req, res) => {

    const recepies = await getRecent()
    

    res.render('home', {recepies})
})



module.exports = {homeRouter}