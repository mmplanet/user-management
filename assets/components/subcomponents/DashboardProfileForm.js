import React, {useEffect, useMemo} from 'react'
import '../../styles/dashboard.css';
import {useDispatch} from "react-redux";
import {Form, FormGroup, FormLabel} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {updateUser} from "../../features/user/userSlice";
import {useCookies} from "react-cookie";
import {NotificationManager} from "react-notifications";

const DashboardProfileForm = (props) => {
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();

    const {register, handleSubmit, reset} = useForm({
        defaultValues: useMemo(() => {
            return props.userData;
        }, [props.userData])
    });
    const onSubmit = data => {
        dispatch(updateUser({token: cookies.token, userId: props.userData.id, userData: data}));
        NotificationManager.info('Profile data successfully updated');
    }

    useEffect(() => {
        if (Object.keys(props.userData).length !== 0) {
            reset(props.userData)
        }
    }, [props.userData])


    return (
        <div className="col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
            <h1 className="mb-3">Personal Details</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="personal-details-form">

                <div className="col-8">
                    <FormGroup>
                        <FormLabel htmlFor="fullName">First Name</FormLabel>
                        <input className="form-control"
                               {...register("firstName")}
                               placeholder="Enter first name"/>
                    </FormGroup>
                </div>
                <div className="col-8">
                    <FormGroup>
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <input type="text" className="form-control"
                               {...register("lastName")}
                               placeholder="Enter last name"/>
                    </FormGroup>
                </div>
                <div className="col-8">
                    <FormGroup>
                        <FormLabel htmlFor="eMail">Email</FormLabel>
                        <input type="email" className="form-control"
                               disabled
                               {...register("email", {disabled: true})}
                               placeholder="Enter email ID"/>
                    </FormGroup>
                </div>
                <div className="col-12 col-md-6 col-lg-6 col-xl-4 mt-3 mb-3 me-0">
                    <div className="text-right">
                        <button type="submit" id="submit" name="submit"
                                className="btn btn-primary justify-content-end">
                            Save
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

DashboardProfileForm.propTypes = {};

export default DashboardProfileForm;
