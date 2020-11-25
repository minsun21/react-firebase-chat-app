import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';

import firebase from '../../firebase';

function LoginPage() {
    const [errorFromSubmit, setErrorFromSubmit] = useState('');
    const [loading, setloading] = useState(false);
    const { register, errors, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            setloading(true);
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            setloading(false);
        } catch (error) {
            setloading(false);
            setErrorFromSubmit(error.message);
            setTimeout(() => {
                setErrorFromSubmit('');
            }, 5000);
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-wrapper__header"><h3>Login</h3></div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This field is required</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 8 })}
                />
                {errors.password && errors.password.type === 'required' && <p>This field is required</p>}
                {errors.password && errors.password.type === 'minLength' && <p>Password must have at least 6 characters</p>}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading} />
                <Link to="/register" className="auth-wrapper__login">아직 아이디가 없다면...</Link>
            </form>
        </div>
    )
}

export default LoginPage
