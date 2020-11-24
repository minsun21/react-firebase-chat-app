import React, { useRef } from 'react'
import {
    Link
} from "react-router-dom";
import { useForm } from 'react-hook-form';

function RegisterPage() {
    const { register, watch, errors } = useForm();
    const password = useRef();
    password.current = watch("password");

    console.log(watch("email"));

    return (
        <div className="auth-wrapper">
            <div className="auth-wrapper__header"><h3>Register</h3></div>
            <form>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This field is required</p>}

                <label>Name</label>
                <input
                    name="name"
                    type="text"
                    ref={register({ required: true, maxLength: 10 })}
                />
                {errors.name && errors.name.type === 'required' && <p>This field is required</p>}
                {errors.name && errors.name.type === 'maxLength' && <p>Your input exceed maximum length</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 8 })}
                />
                {errors.password && errors.password.type === 'required' && <p>This field is required</p>}
                {errors.password && errors.password.type === 'minLength' && <p>Password must have at least 6 characters</p>}
                <label>Password Confirm</label>
                <input
                    name="passwordConfirm"
                    type="password"
                    ref={register({ required: true, validate: (value) => value === password.current })}
                />
                {errors.passwordConfirm && errors.passwordConfirm.type === 'required' && <p>This field is required</p>}
                {errors.passwordConfirm && errors.passwordConfirm.type === 'validate' && <p>The passwords do not match</p>}
                <input type="submit" />
                <Link to="/login" className="auth-wrapper__login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
