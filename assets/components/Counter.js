import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const Counter = () => {
    const globalContext = window.__INITIAL_STATE__;
    const [count, setCount] = useState(globalContext.number || 0);

    const increment = (amount = 1) => {
        setCount(prevState => prevState + amount);
    }

    return <div>
        <Button variant="outline-primary" onClick={() => increment(-1)}>-</Button>
        <span className="mx-2">Current count: {count}</span>
        <Button variant="outline-primary" onClick={() => increment(1)}>+</Button>
        <Link to="/example">LTE</Link>
    </div>
}

export default Counter
