import React, {useEffect, useState} from 'react'
import '../styles/home.css';
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import validator from "validator/es";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser, loginUser, registerUser, setUserToken} from "../features/user/userSlice";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [isRegister, setIsRegister] = useState(false);
    const [loginEmail, setLoginEmail] = useState(null);
    const [loginPassword, setLoginPassword] = useState(null);
    const [registerEmail, setRegisterEmail] = useState(null);
    const [registerPassword, setRegisterPassword] = useState(null);
    const [registerFirstName, setRegisterFirstName] = useState(null);
    const [registerLastName, setRegisterLastName] = useState(null);
    const [invalidFormMessage, setInvalidFormMessage] = useState(null);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidFirstName, setInvalidFirstName] = useState(false);
    const [invalidLastName, setInvalidLastName] = useState(false);
    const userToken = useSelector(state => state.user.token);
    const userData = useSelector(state => state.user.userData);
    const apiErrorMessage = useSelector(state => state.user.errorMessage);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();

    const onLoginFormChange = (event) => {
        setInvalidFormMessage(null);
        if (event.target.getAttribute("field") === 'email') {
            setLoginEmail(event.target.value);
        }

        if (event.target.getAttribute("field") === 'password') {
            setLoginPassword(event.target.value);
        }
    }

    const onRegisterFormChange = (event) => {
        setInvalidFormMessage(null);
        if (event.target.getAttribute("field") === 'email') {
            setInvalidEmail(false);
            setRegisterEmail(event.target.value);
        }

        if (event.target.getAttribute("field") === 'password') {
            setRegisterPassword(event.target.value);
        }

        if (event.target.getAttribute("field") === 'firstName') {
            setRegisterFirstName(event.target.value);
        }

        if (event.target.getAttribute("field") === 'lastName') {
            setRegisterLastName(event.target.value);
        }
    }

    const toggleLogin = () => {
        setIsLogin(true);
        setIsRegister(false);
    }

    const toggleRegister = () => {
        setIsLogin(false);
        setIsRegister(true);
    }

    const login = () => {
        let validEmailInput = true;
        let validPasswordInput = true;

        if (loginEmail === null || !validator.isEmail(loginEmail)) {
            validEmailInput = false;
            setInvalidEmail(true);
        } else {
            setInvalidEmail(false);
        }

        if (loginPassword === null || validator.isEmpty(loginPassword)) {
            validPasswordInput = false;
            setInvalidPassword(true);
        } else {
            setInvalidPassword(false);
        }

        if (validEmailInput && validPasswordInput) {
            dispatch(loginUser({
                email: loginEmail,
                password: loginPassword
            }))
        }
    }

    const register = () => {
        let validEmailInput = true;
        let validPasswordInput = true;
        let validFirstNameInput = true;
        let validLastNameInput = true;

        if (registerEmail === null || !validator.isEmail(registerEmail)) {
            setInvalidEmail(true);
            validEmailInput = false;
        } else {
            setInvalidEmail(false)
        }

        if (registerPassword === null || validator.isEmpty(registerPassword)) {
            validPasswordInput = false;
            setInvalidPassword(true);
        } else {
            setInvalidPassword(false);
        }

        if (registerFirstName === null || validator.isEmpty(registerFirstName)) {
            validFirstNameInput = false;
            setInvalidFirstName(true);
        } else {
            setInvalidFirstName(false);
        }

        if (registerLastName === null || validator.isEmpty(registerLastName)) {
            validLastNameInput = false;
            setInvalidLastName(true);
        } else {
            setInvalidLastName(false);
        }

        if (validEmailInput && validPasswordInput && validFirstNameInput && validLastNameInput) {
            dispatch(registerUser({
                email: registerEmail,
                password: registerPassword,
                firstName: registerFirstName,
                lastName: registerLastName,
            }))
        }
    }

    useEffect(() => {
        if (cookies.token) {
            dispatch(fetchUser({token: cookies.token, userId: 'me'}))
            dispatch(setUserToken(cookies.token));
        }
    }, [cookies.token])

    useEffect(() => {
        if (apiErrorMessage !== null) {
            setInvalidFormMessage(apiErrorMessage);
        }

        if (userToken !== null) {
            setCookie('token', userToken, {path: '/'});
            setInvalidFormMessage(null);
            dispatch(fetchUser({token: userToken, userId: 'me'}))
        }
    }, [userToken, apiErrorMessage])

    useEffect(() => {
        if (Object.keys(userData).length !== 0) {
            navigate("/dashboard");
        }
    }, [userData])


    return (
        <div>
            {
                (userToken == null || typeof userData.id === "undefined") &&
                <div>
                    <section className="mvh-75 vh-50 bg-magenta white">
                        <Container className="container-fluid h-custom">
                            <Row className="d-flex justify-content-center align-items-center vh-100">
                                <Col className="col-md-9 col-lg-6 col-xl-5">
                                    <Image src="./images/home.jpg"
                                           className="img-fluid" alt="Sample image"/>
                                </Col>
                                <Col className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                    <Form method="POST" action="/api/login">
                                        {isLogin && (
                                            <div>
                                                <div className="form-outline mb-4">
                                                    <Form.Label className="form-label">Email</Form.Label>
                                                    <Form.Control type="email"
                                                                  field="email"
                                                                  onChange={onLoginFormChange}
                                                                  className="form-control form-control-lg"
                                                                  placeholder="Enter a valid email"/>
                                                    {invalidEmail && (<Form.Text className="link-danger">
                                                        Invalid email format.</Form.Text>)}
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <Form.Label className="form-label">Password</Form.Label>
                                                    <Form.Control
                                                        onChange={onLoginFormChange}
                                                        type="password"
                                                        field="password"
                                                        className="form-control form-control-lg password"
                                                        placeholder="Enter password"/>
                                                    {invalidPassword && (<Form.Text className="link-danger">
                                                        Password cannot be empty.</Form.Text>)}
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <Form.Check type="checkbox" label="Remember me"/>
                                                    <a href="#!" className="white">Forgot password?</a>
                                                </div>

                                                <div className="text-center text-lg-start mt-4 pt-2">
                                                    <Button
                                                        onClick={login}
                                                        type="button"
                                                        className="btn bg-magenta white btn-lg loginBtn">
                                                        Login
                                                    </Button>
                                                    {invalidFormMessage !== null && (<p>
                                                        <Form.Text className="link-danger">
                                                            {invalidFormMessage}</Form.Text>
                                                    </p>)}
                                                    <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an
                                                        account?</p>
                                                    <p className="fw-bold mt-2 pt-1 mb-0">
                                                        <a onClick={toggleRegister} href="#!"
                                                           className="white">Register</a>
                                                    </p>
                                                </div>
                                            </div>)
                                        }

                                        {isRegister && (
                                            <div>
                                                <div className="form-outline mb-4">
                                                    <Form.Label className="form-label">Email
                                                        address</Form.Label>
                                                    <Form.Control type="email"
                                                                  field="email"
                                                                  onChange={onRegisterFormChange}
                                                                  className="form-control form-control-lg email"
                                                                  placeholder="Enter a valid email address"/>
                                                    {invalidEmail && (<Form.Text className="link-danger">
                                                        Invalid email format.</Form.Text>)}
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <Form.Label className="form-label">Password</Form.Label>
                                                    <Form.Control
                                                        onChange={onRegisterFormChange}
                                                        type="password"
                                                        field="password"
                                                        className="form-control form-control-lg password"
                                                        placeholder="Enter password"/>
                                                    {invalidPassword && (<Form.Text className="link-danger">
                                                        Password cannot be empty.</Form.Text>)}
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <Form.Label className="form-label">First Name</Form.Label>
                                                    <Form.Control
                                                        onChange={onRegisterFormChange}
                                                        type="text"
                                                        field="firstName"
                                                        className="form-control form-control-lg password"
                                                        placeholder="Enter first name"/>
                                                    {invalidFirstName && (<Form.Text className="link-danger">
                                                        First name cannot be empty.</Form.Text>)}
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <Form.Label className="form-label">Last name</Form.Label>
                                                    <Form.Control
                                                        onChange={onRegisterFormChange}
                                                        type="text"
                                                        field="lastName"
                                                        className="form-control form-control-lg password"
                                                        placeholder="Enter last name"/>
                                                    {invalidLastName && (<Form.Text className="link-danger">
                                                        Last name cannot be empty.</Form.Text>)}
                                                </div>

                                                <div className="text-center text-lg-start mt-4 pt-2">
                                                    <Button
                                                        onClick={register}
                                                        type="button"
                                                        className="btn bg-fuchsia border-0 btn-lg registerBtn">
                                                        Register
                                                    </Button>
                                                    {invalidFormMessage !== null && (<p>
                                                        <Form.Text className="link-danger">
                                                            {invalidFormMessage}</Form.Text>
                                                    </p>)}
                                                    <p className="small fw-bold mt-2 pt-1 mb-0">Already have an
                                                        account?</p>
                                                    <p className="fw-bold mt-2 pt-1 mb-0">
                                                        <a onClick={toggleLogin} href="#!" className="white">Login</a>
                                                    </p>
                                                </div>
                                            </div>)
                                        }

                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                    <section className="mvh-25 spacer"></section>
                </div>
            }
        </div>
    )
}

Home.propTypes = {};

export default Home;
