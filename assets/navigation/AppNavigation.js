import React from 'react'

import {createBrowserRouter} from "react-router-dom";

import Home from '../components/Home';
import Dashboard from "../components/Dashboard";

const AppNavigation = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
    },
])

export default AppNavigation;
