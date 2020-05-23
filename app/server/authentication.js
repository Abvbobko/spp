const jwt = require('jsonwebtoken');
const db = require("./db").db;
var bcrypt = require('bcrypt');

const SECRET_KEY = "verysecretkey";

const HEADER = {
    "algorithm": "HS256",
    "expiresIn": "1h"
    // "typ": "JWT"
}

class JWTManipulator {

    create_token(user_id, user_login) {        
        let payload = {
            "id": user_id,
            "login": user_login               
        }
        return jwt.sign(payload, SECRET_KEY, HEADER);
    }

    verify_password(login, password) {
        return db.get_user_by_login(login).then(function(user_info) {
            if (bcrypt.hashSync(password, user_info.salt) === user_info.password) {
                return true;
            }
            return false;
        }).catch((err) => {console.log(err)});

    }
    
    verify_token() {}
}

// проверка пароля юзера
// if (bcrypt.hashSync(passwordEnteredByUser, salt) === rows[0].password) {
//     // да, это работает
//   }

manipulator = new JWTManipulator();

module.exports = { manipulator };