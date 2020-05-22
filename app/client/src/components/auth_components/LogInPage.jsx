import './auth.css';
var React = require('react');
//var sc = require('../server_connector.jsx').sc;
 
class BackLink extends React.Component {
    render() {
        return (
            <div className="back-link">                                   
                <a href="/" className="auth-btn">
                    Back
                </a>                                    
            </div>
        );
    }
}


class LoginField extends React.Component {
    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor="login">Login:</label><br/>
                <input type="text" id="login" name="login" required maxLength="127" className="enter-field auth-enter-field" />
            </div>
        );
    }   
}

class PasswordField extends React.Component {
    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" required className="enter-field auth-enter-field" />
            </div>
        );
    } 
}

export class LogInForm extends React.Component {
    render() {
        return (            
            <div>
                <BackLink />
            <div className="auth-page">
                
                <div className="task-form auth-form"> 
                    <form className="login-form">
                        <LoginField />
                        <PasswordField />
                        <input type="submit" value="Log in" className="task-item task-form-item button auth-btn auth-enter-field" />
                    </form>
                </div>
            </div> </div>
        );
    }
}
