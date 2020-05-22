var React = require('react');

export class AuthenticationButton extends React.Component {
    render() {
        return (
            <div> 
                <form>
                    <span>
                        <a href="/login" className="auth-btn">Log in</a>
                        <span> / </span>
                        <a href="/registration" className="auth-btn">Sign up</a>
                    </span>
                </form>
            </div>
        );
    }
}
