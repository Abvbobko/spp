var React = require('react');

export class AuthenticationButton extends React.Component {
    render() {
        return (
            <div> 
                <form>
                    <span>
                        <a href="/login" className="auth-btn">Вход</a>
                        <span> / </span>
                        <a href="#" className="auth-btn">Регистрация</a>
                    </span>
                </form>
            </div>
        );
    }
}
