module.exports.signUpErrors = (err) => {
    let errors = {
        name : '', 
        surname : '', 
        email : '', 
        password : '', 
        nationality : '', 
        phoneNumber : '',
        adress : '', 
        adressCity : '', 
        adressCountry : '', 
        gender : '', 
        language : '', 
        birthDate : '', 
        type : ''}

        if (err.message.includes('name'))
            errors.name = "Incorrect-name";

        if (err.message.includes('surname'))
            errors.surname = "Incorrect-surname"
        
        if (err.message.includes('email'))
            errors.email = "Incorrect-email";

        if (err.message.includes('password'))
            errors.password = "Incorrect-password"
        
        // if (err.message.includes('nationality'))
        //     errors.nationality = "Incorrect-nationality";

        if (err.message.includes('phoneNumber'))
            errors.phoneNumber = "Incorrect-phoneNumber"

        if (err.message.includes('adress'))
            errors.adress = "Incorrect-address"

        if (err.message.includes('adressCity'))
            errors.adressCity = "Incorrect-adressCity";

        if (err.message.includes('adressCountry'))
            errors.adressCountry = "Incorrect-adressCountry"

        if (err.message.includes('gender'))
            errors.gender = "Incorrect-gender";

        if (err.message.includes('language'))
            errors.language = "Incorrect-language"

        if (err.message.includes('birthDate'))
            errors.birthDate = "Incorrect-birthDate"
        
        if (err.message.includes('type'))
            errors.type = "Incorrect-type"

        // Une requête ne renvoie qu'une erreur donc 1 seul des 2 if est utilisé si l'email et le phoneNum sont déjà pris.
        if (err.code === 11000 &&Object.keys(err.keyValue)[0].includes('email'))
            errors.email = "email already taken"

        if (err.code === 11000 &&Object.keys(err.keyValue)[0].includes('phoneNumber'))
            errors.phoneNumber = "phoneNumber already taken"

        
        return errors
}



module.exports.signInErrors = (err) => {
    let errors = {email : '', password: ''}

    if (err.message.includes('unverified'))
        errors.email = "email unverified"

    if (err.message.includes('email'))
        errors.email = "email unknown"

    if (err.message.includes('Blocked'))
        errors.email = "Blocked user" 

    if (err.message.includes('password'))
        errors.password = "password does not match"

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = {format : '', maxSize: ''}

    if (err.message.includes('invalid file'))
        errors.format = "Incompatible format"

    if (err.message.includes('max size'))
        errors.maxSize = "Size limit exceeded"

    return errors
}