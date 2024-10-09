import React, { useState } from 'react';
import './Login.css';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
    const { login, error, isLoading } = useLogin();
    const [userLogin, setUserLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        await login(userLogin, password); // Use state values for login
    };

    return (
        <div className='login_container'>
            <form onSubmit={handleSubmit} className='login_form'>
                <div className="login_img">
                    <img
                        src="https://cdn.leonardo.ai/users/016cc9f7-4add-499e-8b9c-1d94e9ace770/generations/a2a5a4bd-c5fa-44d3-85d5-87a3797d723d/Leonardo_Phoenix_A_futuristic_logotype_for_a_webserver_featuri_2.jpg"
                        alt="login logo"
                    />
                </div>
                <div className="login_title">
                    <h1>Login to the server</h1>
                </div>
                <div className="login_elements">
                    <div className="login_element">
                        <input
                            type="text"
                            placeholder='Server login'
                            value={userLogin}
                            onChange={(e) => setUserLogin(e.target.value)} // Update state on input change
                        />
                    </div>
                    <div className="login_element">
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle password visibility
                            placeholder='Server password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update state on input change
                        />
                        <button
                            type="button"
                            className="show-password-btn"
                            onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <div className="login_btn">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
            </form>
        </div>
    );
};

export default Login;
