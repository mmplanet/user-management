import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends Component {

    render() {
        return (
            <div>
                <h4>
                    404 Page Not Found
                </h4>
                <Link to="/"> Go back to homepage </Link>
            </div>
        )
    }

}


export default NotFoundPage

