const jwt = require('jsonwebtoken');

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

    verify_password() {}
    
    verify_token() {}
}

// проверка пароля юзера
// if (bcrypt.hashSync(passwordEnteredByUser, salt) === rows[0].password) {
//     // да, это работает
//   }

manipulator = new JWTManipulator();

module.exports = { manipulator };