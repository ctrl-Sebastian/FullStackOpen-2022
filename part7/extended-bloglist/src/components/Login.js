import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { logUserIn } from '../reducers/loginReducer'

const LoginForm = ({
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    const dispatch = useDispatch()

    const handleLogin = (event) => {
        event.preventDefault()
        const credentials = {
            username,
            password,
        }
        dispatch(logUserIn(credentials))

    }

    return (
        <div>
            <h2>Log in</h2>

            <form onSubmit={handleLogin}>
                <div>
                username
                    <input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                password
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button id="login-button" type="submit">login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}

export default LoginForm