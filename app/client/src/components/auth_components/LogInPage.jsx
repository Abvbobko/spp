var React = require('react');
//var sc = require('../server_connector.jsx').sc;
 
class LoginField extends React.Component {

}

class PasswordField extends React.Component {
    
}

export class LogInForm extends React.Component {
    render() {
        return (
            <div className="task-form"> 
                <form>
                    <LoginField />
                    <PasswordField />
                    <input type="submit" value="Войти" className="task-item task-form-item button" />
                </form>
            </div>
        );
    }
}
