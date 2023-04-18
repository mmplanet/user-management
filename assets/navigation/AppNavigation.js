import React from 'react'

import {createBrowserRouter} from "react-router-dom";

import Home from '../components/Home';
import Example from "../components/Example";
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";

const AppNavigation = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
    },
    {
        path: "/:slug",
        element: <Profile/>,
    },
    {
        path: "/example",
        element: <Example/>,
    },
])

export default AppNavigation;
