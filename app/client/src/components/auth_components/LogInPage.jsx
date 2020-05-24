import './auth.css';
var React = require('react');
var sc = require('../../server_connector.jsx').sc;
 
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
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log("send data");
        sc.log_in(data).then(function(err) {
            if (err) {
                console.log("errrorrr");
                alert(err);
            } else {
                console.log("ok");
                window.location = "http://localhost:3000";
            }
        });
        //если ошибка, то alert
    }

    render() {
        return (            
            <div>
                <BackLink />
            <div className="auth-page">
                
                <div className="task-form auth-form"> 
                    <form className="login-form" onSubmit={this.handleSubmit}>
                        <LoginField />
                        <PasswordField />
                        <input type="submit" value="Log in" className="task-item task-form-item button auth-btn auth-enter-field" />
                    </form>
                </div>
            </div> </div>
        );
    }
}
