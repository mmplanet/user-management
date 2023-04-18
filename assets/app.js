/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import 'react-notifications/lib/notifications.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

// boostrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// // start the Stimulus application
// import './bootstrap';

import React from 'react';
import {createRoot} from 'react-dom/client';

import AppNavigation from "./navigation/AppNavigation";
import {RouterProvider} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Provider} from "react-redux";
import store from "./app/store";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import Modal from "react-modal";
Modal.setAppElement('#root');

const App = () => {
    return <div>
        <Header/>
        <div className="body-main">
            <header className="masthead">
                <div className="align-items-center">
                    <RouterProvider router={AppNavigation}/>
                </div>
            </header>
        </div>
        <NotificationContainer/>
        <Footer/>
    </div>
}

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
    </Provider>
)
