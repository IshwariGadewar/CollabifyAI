/* eslint-disable no-unused-vars */
import React, { useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import Alert from '../components/Alerts';
import { UserContext } from '../context/user.context';

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();

    function validateForm() {
        if (password.length < 6) {
            setAlert({ message: 'Password must be at least 6 characters long.', type: 'error' });
            return false;
        }
        if (email.length > 50) {
            setAlert({ message: 'Email must not exceed 50 characters.', type: 'error' });
            return false;
        }
        return true;
    }

    function submitHandler(e){
        e.preventDefault()

        setAlert(null);
        if (!validateForm()) return;

        axios.post('/users/register',{
            email,
            password
        }).then((res)=>{
            console.log(res.data)
            localStorage.setItem('token',res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            // If the error message indicates user already exists, show the alert
            if (err.response && err.response.data.message === "User with this email already exists") {
                setAlert({ message: 'This email is already registered. Please use a different one.', type: 'error' });
            } else {
                setAlert({ message: err.response.data.message || 'Something went wrong. Please try again.', type: 'error' });
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
                <form
                    onSubmit={submitHandler}
                >
                    {alert && <Alert message={alert.message} type={alert.type} />}
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">LogIN</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
