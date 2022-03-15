const helpers = {};


helpers.tipo_usuario = (tipo)=>{

    if(tipo == "ADMINISTRADOR"){
        return true;
    }

}

helpers.format = (fecha)=>{

    var hoy = new Date(fecha)

    return ('0' + (hoy.getDate())).slice(-2) + "/"+('0' + (hoy.getMonth() + 1)).slice(-2) +"/"+ hoy.getFullYear()

}


helpers.math = (lvalue, operator, rvalue)=>{
    
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];

}


module.exports = helpers;