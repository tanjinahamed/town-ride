import React, { useContext, useState } from 'react';
import './SignIn.css';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, SignInUserWithEmailAndPassword, gitHubSignIn, googleSignIn, initializeSignIn, updateUserInfo } from './signInManager';

const SignIn = () => {
    initializeSignIn();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        userName: '',
        email: '',
        password: '',
        imgSrc: '',
        error: '',
        success: false
    });

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const handleResponse = (res, redirect) => {
        setUser(res)
        setLoggedInUser(res)
        if (redirect) {
            history.replace(from);
        }
    }

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(res => {
                handleResponse(res, true)
            })
    }

    const handleGitHubSignIn = () => {
        gitHubSignIn()
            .then(res => {
                handleResponse(res, true);
                setLoggedInUser(res);
            })
    }

    const handleSubmit = (event) => {
        if (newUser && user.name && user.email && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                    updateUserInfo(user.name);
                })
        }
        if (!newUser && user.email && user.password) {
            SignInUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                    setLoggedInUser(res);
                })
        }
        event.preventDefault();
    }

    const handleBlur = (event) => {
        let isFormValid;

        if (event.target.name === 'name') {
            isFormValid = event.target.value.length > 4;
        }

        if (event.target.name === 'email') {
            isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
        }

        if (event.target.name === 'password') {
            const isPasswordValid = event.target.value.length > 6;
            const isPasswordHasNumber = /\d{1}/.test(event.target.value);

            if (isPasswordValid && isPasswordHasNumber) {
                setPassword(event.target.value)
            }
            isFormValid = isPasswordValid && isPasswordHasNumber;
        }


        if (event.target.name === 'ConfirmPassword') {
            const isPasswordValid = event.target.value.length > 6;
            const isPasswordHasNumber = /\d{1}/.test(event.target.value);

            if (isPasswordValid && isPasswordHasNumber) {
                setConfirmPassword(event.target.value)
            }
            isFormValid = isPasswordValid && isPasswordHasNumber;
        }

        if (isFormValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }

    return (
        <div className="form-signin mt-5">
            <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal">{newUser ? 'Create an account' : 'Signin'}</h1>
                {
                    newUser &&
                    <>
                        <label htmlFor="inputName" className="visually-hidden">User Name</label>
                        <input type="text" onBlur={handleBlur} name="name" className="form-control" placeholder="User Name" required />
                    </>
                }
                <label htmlFor="inputEmail" className="visually-hidden">Email address</label>
                <input type="email" onBlur={handleBlur} name="email" className="form-control" placeholder="Email address" required autoFocus />

                {
                    newUser ? <div>
                        <label htmlFor="inputPassword" className="visually-hidden">Password</label>
                        <input type="password" onBlur={handleBlur} name="password" className="form-control" placeholder="Password" required />
                        <label htmlFor="inputPassword" className="visually-hidden">Confirm Password</label>
                        <input type="password" onBlur={handleBlur} name="ConfirmPassword" className="form-control" placeholder="Confirm Password" required />

                    </div> : <div><label htmlFor="inputPassword" className="visually-hidden">Password</label>
                        <input type="password" onBlur={handleBlur} name="password" className="form-control" placeholder="Password" required /></div>
                }
                <button className="w-100 btn btn-lg btn-outline-success mb-2" type="submit">{newUser ? 'Create an account' : 'Signin'}</button>
                <p>{newUser ? 'Already have an account' : 'Don’t have an account'} ?
                 <span onClick={() => setNewUser(!newUser)} className="text-warning" style={{ cursor: 'pointer' }}>
                        {newUser ? ' Signin' : ' Create an account'}
                    </span></p>
                <p>Or</p>
                <hr />
                <button onClick={handleGoogleSignIn} className="w-100 btn btn-lg btn-outline-success mb-2" type="submit">Connect with Google</button>
                <button onClick={handleGitHubSignIn} className="w-100 btn btn-lg btn-outline-success mb-2" type="submit">Connect with GitHub</button>
            </form>
            {
                console.log(user)
            }
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged In'} successfully</p>
            }
        </div>
    );
};

export default SignIn;