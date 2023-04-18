import React, {useEffect, useState} from 'react'
import '../../styles/dashboard.css';
import {useDispatch} from "react-redux";
import {Button, Form, FormGroup, FormLabel, Table} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useCookies} from "react-cookie";
import {NotificationManager} from "react-notifications";
import {apiAddGroup, apiAddUserToGroup, apiFetchGroups, apiRemoveUserFromGroup} from "../../app/InterNationsAPI";
import {fetchGroups} from "../../features/group/groupSlice";
import {fetchUsers} from "../../features/user/userSlice";

const OrganizeUser = (props) => {
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();
    const [userGroups, setUserGroups] = useState([]);
    const [listGroups, setListGroups] = useState([]);

    const {register, handleSubmit} = useForm();

    useEffect(() => {
        setListGroups(props.groups);
        apiFetchGroups({token: cookies.token, userId: props.user.id}).then(response => {
            let userToBeInGroups = [];
            if (response.length > 0) {
                setUserGroups(response);
                userToBeInGroups = props.groups.filter(group => {
                    let found = false;
                    response.forEach(i => {
                        if (group.id === i.id) {
                            found = true;
                        }

                    });

                    return !found;
                })
            } else {
                userToBeInGroups = props.groups
            }

            setListGroups(userToBeInGroups);
        })
    }, [props.user])

    const onSubmit = data => {
        const groupId = data.group !== '' ? data.group : listGroups[0].id
        apiAddUserToGroup({
            token: cookies.token,
            userId: props.user.id,
            groupId: groupId
        }).then((response) => {
            if (response.hasOwnProperty('violations')) {
                response.violations.forEach(violation => {
                    NotificationManager.error(violation.title, violation.propertyPath);

                })
            } else {
                NotificationManager.info('Group added successfully');
                dispatch(fetchGroups({token: cookies.token}))
                dispatch(fetchUsers({token: cookies.token}))
                props.closeModal();
            }
        })
    }

    const removeUserFromGroup = group => {
        apiRemoveUserFromGroup({
            token: cookies.token,
            userId: props.user.id,
            groupId: group.id
        }).then((response) => {
            if (response !== null) {
                NotificationManager.info('User successfully removed from group');
                dispatch(fetchGroups({token: cookies.token}))
                dispatch(fetchUsers({token: cookies.token}))
                props.closeModal();
            }
        })
    }

    return (
        <div className="col-12">
            <div
                style={{display: listGroups.length > 0 ? 'block' : 'none'}}
            >
                <h1 className="mb-3">Add user to group</h1>
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className="personal-details-form">
                    <FormGroup>
                        <FormLabel htmlFor="group">Group</FormLabel>
                        <select className="form-control"
                                {...register("group")}
                                placeholder="Select Group">
                            {listGroups.map(group => {
                                return (
                                    <option
                                        value={group.id}
                                        key={group.id}
                                        id={group.id}>
                                        {group.name}
                                    </option>
                                )
                            })}
                        </select>
                    </FormGroup>
                    <br/>
                    <div className="text-right">
                        <Button type="submit"
                                disabled={!(listGroups.length > 0)}
                                id="submit"
                                name="submit"
                                className="btn btn-primary justify-content-end">
                            Save
                        </Button>
                    </div>
                </Form>
            </div>

            <div
                style={{display: userGroups.length > 0 ? 'block' : 'none'}}
            >
                <h1 className="mb-3">Remove user from group</h1>
                <Table className="users-table">
                    <thead>
                    <tr>
                        <th scope="col">Group Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        userGroups.map(group => {
                            return (
                                <tr className="mt-1" key={group.id}>
                                    <td>{group.name}</td>
                                    <td>
                                        <Button
                                            onClick={() => removeUserFromGroup(group)}
                                            className="btn-danger remove-from-group">
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>

        </div>
    )
}

OrganizeUser.propTypes = {};

export default OrganizeUser;
