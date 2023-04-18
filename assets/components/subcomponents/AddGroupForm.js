import React from 'react'
import '../../styles/dashboard.css';
import {useDispatch} from "react-redux";
import { Form, FormGroup, FormLabel} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useCookies} from "react-cookie";
import {NotificationManager} from "react-notifications";
import {apiAddGroup} from "../../app/InterNationsAPI";
import {fetchGroups} from "../../features/group/groupSlice";

const AddGroupForm = (props) => {
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();

    const {register, handleSubmit} = useForm();
    const onSubmit = data => {
        apiAddGroup({token: cookies.token, group: data}).then((response) => {
            if (response.hasOwnProperty('violations')) {
                response.violations.forEach(violation => {
                    NotificationManager.error(violation.title, violation.propertyPath);

                })
            } else {
                NotificationManager.info('Group added successfully');
                dispatch(fetchGroups({token: cookies.token}))
                props.closeModal();
            }
        })
    }

    return (
        <div className="col-12">
            <h1 className="mb-3">Add group</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="personal-details-form">

                <FormGroup>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <input className="form-control"
                           {...register("name")}
                           placeholder="Enter group name"/>
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

AddGroupForm.propTypes = {};

export default AddGroupForm;
