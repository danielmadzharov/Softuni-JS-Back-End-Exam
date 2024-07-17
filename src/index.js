const express = require('express');
const { configDatabase } = require('./config/configDatabase');
const { configExpress } = require('./config/configExpress');
const { configHbs } = require('./config/configHbs');
const { configRoutes } = require('./config/configRoutes');
const { register, login } = require('./services/user');
const e = require('express');
const { createToken } = require('./services/jwt');


const PORT = process.env.PORT || 3000;

start()
async function start(){
    const app = express();
    await configDatabase()
    configHbs(app)
    configExpress(app);
    configRoutes(app)

    app.listen(PORT, () => {
        console.log(`Application running on port ${PORT}`);
    });
}

