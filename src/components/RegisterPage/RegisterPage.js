import React, { useRef, useState } from 'react'
import {
    Link
} from "react-router-dom";
import { useForm } from 'react-hook-form';

import firebase from '../../firebase';
import md5 from 'md5';

function RegisterPage() {
    const [errorFromSubmit, setErrorFromSubmit] = useState('');
    const [loading, setloading] = useState(false);
    const { register, watch, errors, handleSubmit } = useForm();
    const password = useRef();
    password.current = watch("password");

    const onSubmit = async (data) => {
        try {
            setloading(true);
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            console.log(createdUser)
            await createdUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })

            // DB 
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL
            })
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
            <div className="auth-wrapper__header"><h3>Register</h3></div>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                {errorFromSubmit && <p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading} />
                <Link to="/login" className="auth-wrapper__login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
