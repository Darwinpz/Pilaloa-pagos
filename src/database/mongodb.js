const mongoose = require('mongoose');


// Conexión a MongoDB

const URI = process.env.MONGOURI;

mongoose.connect(URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("BD MONGO: CONECTADO"))
    .catch(err => console.error("BD MONGO: " + err.message));

module.exports = mongoose;