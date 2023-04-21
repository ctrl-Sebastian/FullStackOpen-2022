import {  useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const Users = () => {
    const users = useSelector((state) => state.users)
    const padding = {
        padding: 5
    }
    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th><strong>name</strong></th>
                        <th><strong>Blogs created</strong></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link style={padding} to={`/users/${user.id}`}>{user.username}</Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users