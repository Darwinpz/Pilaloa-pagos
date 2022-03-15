//Acceso al archivo .env
require('dotenv').config();

// Inicializador de la app
const app = require("./src/app");

app.listen(app.get('port'),()=>{

    console.log("Servidor iniciado, Puerto: ",app.get('port'))

})