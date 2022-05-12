import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Card } from 'react-bootstrap';
import * as usersService from '../../services/usersService';
import { Link, useNavigate } from 'react-router-dom';
import 'toastr/build/toastr.css';
import { loginSchema } from './formSchema';
import './userauth.css';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import debug from 'sabio-debug';
function LoginPage(props) {
    const _logger = debug.extend('login page');
    const navigate = useNavigate();

    useEffect(() => {
        _logger(props.currentUser);
        if (props.currentUser.isLoggedIn === true) {
            navigate('/error-404');
        }
    }, []);

    const [loginFormInitial] = useState({
        email: '',
        password: '',
    });

    const onLoginSuccess = () => {
        usersService.getCurrent().then(onCurrentSuccess);
        Swal.fire({
            title: 'Login successful',
            icon: 'success',
        });
    };

    const onCurrentSuccess = (response) => {
        const credsArr = response.data.item.roles;
        const state = { type: 'LOGIN', payload: response.data.item };
        state.payload.email = state.payload.name;
        state.payload.isLoggedIn = true;
        _logger('loginCheck', response);
        for (let i = 0; i < credsArr.length; i++) {
            const element = credsArr[i];
            if (element === 'Admin') {
                navigate('/dashboard/campaign', { state });
            } else if (element === 'User') {
                navigate('/surveys/new', { state });
            } else if (element === 'Campaign') {
                navigate('/current', { state });
            }
        }
    };

    const onLogin = (userCredentials) => {
        usersService.login(userCredentials).then(onLoginSuccess).catch(onLoginError);
    };

    const onLoginError = (response) => {
        const error = response.response.data.errors[0]
            ? response.response.data.errors[0]
            : 'An error has occured while processing your request';
        Swal.fire({
            title: 'Login unsuccessful',
            text: error,
            icon: 'error',
        });
    };

    const loginForm = (
        <Formik
            enableReinitialize={true}
            initialValues={loginFormInitial}
            validationSchema={loginSchema}
            onSubmit={onLogin}>
            <Form>
                <div className="form-group row justify-content-center my-3">
                    <label htmlFor="email" className="col-form-label">
                        Email
                    </label>

                    <Field
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                    />
                    <ErrorMessage name={'email'} component="div" className="error my-1 mx-1" />
                </div>

                <div className="form-group row justify-content-center my-3">
                    <label htmlFor="password" className="col-form-label">
                        Password
                        <Link to="/forgot-password" className="text-muted float-end">
                            <small>{'Forgot your password?'}</small>
                        </Link>
                    </label>

                    <Field
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                    />
                    <ErrorMessage name={'password'} component="div" className="error my-1 mx-1" />
                </div>
                <div className="col-3 mx-auto">
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </div>
            </Form>
        </Formik>
    );
    return (
        <React.Fragment>
            <div className="auth-fluid auth-bg">
                {/* Auth fluid left content */}
                <div className="auth-fluid-form-box">
                    <div className="align-items-center d-flex h-100">
                        <Card.Body>
                            <h4 className="mt-0">{'Sign In'}</h4>
                            <p className="text-muted mb-4">
                                {'Enter your email address and password to access account.'}
                            </p>

                            {loginForm}

                            <footer className="footer footer-alt">
                                <p className="text-muted">
                                    {"Don't have an account?"}{' '}
                                    <Link to={'/register'} className="text-muted ms-1">
                                        <b>{'Sign Up'}</b>
                                    </Link>
                                </p>
                            </footer>

                            {/* social links */}
                            <div className="text-center mt-4">
                                <p className="text-muted font-16">{'Sign in with'}</p>
                                <ul className="social-list list-inline mt-3">
                                    <li className="list-inline-item">
                                        <Link to="#" className="social-list-item border-primary text-primary">
                                            <i className="mdi mdi-facebook"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" className="social-list-item border-danger text-danger">
                                            <i className="mdi mdi-google"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" className="social-list-item border-info text-info">
                                            <i className="mdi mdi-twitter"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#" className="social-list-item border-secondary text-secondary">
                                            <i className="mdi mdi-github"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </Card.Body>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

LoginPage.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isChecked: PropTypes.bool,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.node,
    }),
};
export default LoginPage;
