const { Router } = require("express");
const { getAll, getById, searchRecipe } = require("../services/recepy");


const catalogRouter = Router();

catalogRouter.get('/catalog',async (req,res) => {
    const recepies =  await getAll()

    res.render('catalog', {recepies})
})

catalogRouter.get('/catalog/:id', async (req, res) => {
    const id =  req.params.id
    const recepies = await getById(id)

    if(!recepies){
        res.render('404')
        return;
    }

    recepies.recommendations = recepies.recommendList.length;
    recepies.hasUser = res.locals.hasUser;
    recepies.isOwner = req.user?._id == recepies.owner.toString();
    recepies.hasRecommended = recepies.recommendList.some(r => r.toString() == req.user?._id);

    res.render('details', { recepies })
    
})


catalogRouter.get('/search', async (req, res) => {

    res.render('search');
});
module.exports = {catalogRouter}