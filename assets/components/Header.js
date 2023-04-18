import React, {useRef, useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import isEmpty from "validator/es/lib/isEmpty";
import {logoutUser} from "../features/user/userSlice";

const Header = () => {

    const userData = useSelector(state => state.user.userData);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [displayName, setDisplayName] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const logout = () => {
        logoutUser();
        removeCookie('token');
        window.location.reload(false);
    }

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    }

    useEffect(() => {
        if (userData.hasOwnProperty('email') && !isEmpty(userData.email)) {
            let displayName = userData.email.substring(0, userData.email.indexOf("@"));
            if (userData.hasOwnProperty('firstName')
                && userData.firstName !== null
                && !isEmpty(userData.firstName)) {
                displayName = userData.firstName;
            }
            setDisplayName(displayName);
        }
    }, [userData])

    const ref = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowUserDropdown(false)
            }
        };
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <nav className="navbar mt-4 ms-5 me-5 navbar-expand-lg navbar-light fixed-top shadow-sm"
             ref={ref}
             id="mainNav">
            <div className="container px-5">
                <a className="navbar-brand fw-bold" href="#page-top">InterNations</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarResponsive"
                    aria-controls="navbarResponsive"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    Menu
                    <i className="bi-list"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav me-auto me-4 my-3 my-lg-0">
                        <li className="nav-item">
                            <a className="nav-link me-lg-3" href="#discover">Discover</a>
                        </li>
                    </ul>
                    {(userData.id !== undefined) && (
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle"
                                    onClick={toggleUserDropdown}
                                    type="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded={showUserDropdown}>
                                {displayName}
                            </button>
                            <div className={`dropdown-menu ${showUserDropdown ? 'show' : ''}`}
                                 aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item"
                                   onClick={logout}
                                   href="#">Logout</a>
                            </div>
                        </div>
                    )}
                    {(userData.id === null) && (
                        <div>
                            <button className="btn bg-magenta white nav-login rounded-pill px-3 me-2 mb-2 mb-lg-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#feedbackModal">
                        <span className="d-flex align-items-center">
                            <i className="bi-person-fill me-2"></i>
                            <span className="small">Login</span>
                        </span>
                            </button>
                            <button className="btn bg-fuchsia white nav-signup rounded-pill px-3 mb-2 mb-lg-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#feedbackModal">
                        <span className="d-flex align-items-center">
                            <i className="bi-person-fill me-2"></i>
                            <span className="small">Sign up</span>
                        </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

Header.propTypes = {};

export default Header;
