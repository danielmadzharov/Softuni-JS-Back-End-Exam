

const { catalogRouter } = require("../controllers/catalog")
const { homeRouter } = require("../controllers/home")
const { recepryRouter } = require("../controllers/recepy")
const { userRouter } = require("../controllers/user")


function configRoutes(app){
  
    app.use(homeRouter)
    app.use(userRouter)
    app.use(recepryRouter)
    app.use(catalogRouter)



    app.get("*", (req, res)=>{
        res.render('404')
    })
}
module.exports = { configRoutes }