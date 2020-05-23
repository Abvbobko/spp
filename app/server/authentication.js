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
    
    verify_token(token) {
        // return tokens
        jwt.verify(token, SECRET_KEY, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        }); // may be async and create to sync (add options?)
        //consle.log(decoded.login)
    }
}

manipulator = new JWTManipulator();

module.exports = { manipulator };