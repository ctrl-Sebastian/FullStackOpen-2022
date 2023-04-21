import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { logUserIn } from '../reducers/loginReducer'

import { useNavigate } from 'react-router-dom'

import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = (event) => {
        event.preventDefault()
        const credentials = {
            username,
            password,
        }
        dispatch(logUserIn(credentials))
        navigate('/')
    }

    return (
        <div>
            <h2>Log in</h2>

            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />

                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <Button variant="primary" type="submit">login</Button>
                </Form.Group>
            </Form>
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