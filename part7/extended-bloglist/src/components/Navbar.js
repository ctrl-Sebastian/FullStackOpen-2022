import {  useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { logUserOut } from '../reducers/loginReducer'

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.login)

    const handleLogout = async () => {
        dispatch(logUserOut())
        navigate('/')
    }

    return (
        <div>
            <Link to='/'>Blogs</Link>
            <Link to='/users/'>Users</Link>
            {user
                ? <em>{user.name} logged in<button onClick={handleLogout}>log out</button></em>
                : <Link to="/login">login</Link>
            }
        </div>
    )
}

export default Navbar