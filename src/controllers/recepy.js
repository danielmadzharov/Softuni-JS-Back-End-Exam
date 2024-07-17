const { Router } = require("express");


const {body, validationResult} =  require('express-validator')
const { parseError } = require("../util");
const { isGuest , isUser} = require("../middlewares/guards");
const { create, getById, update, deleteById, addRecommend } = require("../services/recepy");


const recepryRouter = Router();


recepryRouter.get('/create', isUser(), async (req, res) => {

    res.render('create')
});


recepryRouter.post('/create', isUser(),
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long'),
    body('image').isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with http:// or https://'),

    async (req, res) => {
        const userId = req.user._id;
        try {
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                throw validation.errors;
            }

            const result = await create(req.body, userId);
            res.redirect('/catalog');
        } catch (err) {
            res.render('create', { data: req.body, errors: parseError(err).errors });
        }
    }
);

recepryRouter.get('/edit/:id', isUser(), async (req, res) => {
    const recepies = await getById(req.params.id)

   

    if(!recepies){
        res.render('404');
        return
    }

    const isOwner = req.user?._id == recepies.owner.toString()

    if(!isOwner){
        res.redirect('/login');
        return;
    }

    res.render('edit', {data: recepies})
})



recepryRouter.post('/edit/:recepyId', isUser(), async (req, res) => {
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters long'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long'),
    body('image').isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with http:// or https://')
    
    const userId = req.user._id
    const recepyId = req.params.recepyId
    try{
        const validation = validationResult(req)
        if(validation.errors.length){
            throw validation.errors
        }

        const result = await update(recepyId, req.body, userId)
        res.redirect('/catalog/' + recepyId)
    }catch(err){
        res.render('edit', {data: req.body, errors: parseError(err).errors})
    }
})

recepryRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id

   
    try{
        await deleteById(id, req.user._id)
        res.redirect('/catalog/')
    }catch(err){
        res.redirect('/catalog/')
    }
});
recepryRouter.get('/recommend/:recepyId', isUser(), async (req, res) => {
    const recepyId = req.params.recepyId
    const userId = req.user._id

    try{

        const result = await addRecommend(recepyId, userId)
        res.redirect('/catalog/' + recepyId)
    }catch(err){
        res.render('details', {errors: parseError(err).errors})
    }
})


module.exports = {
    recepryRouter
}