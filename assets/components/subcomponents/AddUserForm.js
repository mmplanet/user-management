import React from 'react'
import '../../styles/dashboard.css';
import {useDispatch} from "react-redux";
import { Form, FormGroup, FormLabel} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {fetchUsers} from "../../features/user/userSlice";
import {useCookies} from "react-cookie";
import {NotificationManager} from "react-notifications";
import {apiAddUser} from "../../app/InterNationsAPI";

const AddUserForm = (props) => {
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();

    const {register, handleSubmit} = useForm();
    const onSubmit = data => {
        apiAddUser({token: cookies.token, user: data}).then((response) => {
            if (response.hasOwnProperty('violations')) {
                response.violations.forEach(violation => {
                    NotificationManager.error(violation.title, violation.propertyPath);

                })
            } else {
                NotificationManager.info('User added successfully');
                dispatch(fetchUsers({token: cookies.token}))
                props.closeModal();
            }
        })
    }

    return (
        <div className="col-12">
            <h1 className="mb-3">Add User</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="personal-details-form">

                <FormGroup>
                    <FormLabel htmlFor="fullName">First Name</FormLabel>
                    <input className="form-control"
                           {...register("firstName")}
                           placeholder="Enter first name"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <input type="text" className="form-control"
                           {...register("lastName")}
                           placeholder="Enter last name"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="eMail">Email</FormLabel>
                    <input type="email" className="form-control"
                           {...register("email")}
                           placeholder="Enter email ID"/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="fullName">Password</FormLabel>
                    <input className="form-control"
                           {...register("password")}
                           placeholder="Enter user password"/>
                </FormGroup>
                <br/>
                <div className="text-right">
                    <button type="submit" id="submit" name="submit"
                            className="btn btn-primary justify-content-end">
                        Save
                    </button>
                </div>
            </Form>
        </div>
    )
}

AddUserForm.propTypes = {};

export default AddUserForm;
