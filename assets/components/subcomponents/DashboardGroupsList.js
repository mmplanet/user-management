import React from 'react'
import '../../styles/dashboard.css';
import {useDispatch} from "react-redux";
import {Button, Table} from "react-bootstrap";
import {useCookies} from "react-cookie";
import Modal from "react-modal";
import AddGroupForm from "./AddGroupForm";
import {confirmAlert} from "react-confirm-alert";
import {apiDeleteGroup} from "../../app/InterNationsAPI";
import {fetchGroups} from "../../features/group/groupSlice";
import {NotificationManager} from "react-notifications";

const DashboardGroupsList = (props) => {
    const [addGroupModalIsOpen, setAddGroupModalIsOpen] = React.useState(false);

    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();

    const addGroupModalStyle = {
        content: {
            width: '50%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const openAddGroupModal = () => {
        setAddGroupModalIsOpen(true);
    }

    const closeAddGroupModal = () => {
        setAddGroupModalIsOpen(false);
    }

    const deleteGroup = (group) => {
        confirmAlert({
            title: `Delete group ${group.name}`,
            message: 'Are you sure to remove this group?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        apiDeleteGroup({token: cookies.token, groupId: group.id}).then((response) => {
                            if (response.status === 200) {
                                dispatch(fetchGroups({token: cookies.token}))
                                NotificationManager.info('Group deleted.');
                            } else {
                                response.json().then(responseJson => {
                                    NotificationManager.error(responseJson.detail);
                                });
                            }
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                    }
                }
            ]
        });
    }

    return (
        <div className="col-12 col-md-12 col-lg-6 col-xl-6">
            <div className="col-12">
                <h1 className="mb-3 mt-3 d-inline">Groups</h1>
                <Button className="btn-info mt-3 add-group-btn" onClick={openAddGroupModal}>
                    Add Group
                </Button>
            </div>
            <Table className="groups-table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.allGroups.map(group => (
                            <tr key={group.id}>
                                <td scope="row">{group.id}</td>
                                <td scope="row">{group.name}</td>
                                <td scope="row">
                                    <Button
                                        onClick={() => deleteGroup(group)}
                                        className="btn-danger">
                                        delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </Table>

            <Modal
                isOpen={addGroupModalIsOpen}
                onRequestClose={closeAddGroupModal}
                style={addGroupModalStyle}
                contentLabel="Add User"
            >
                <Button className="btn-danger"
                        style={{float: "right"}}
                        onClick={closeAddGroupModal}>x
                </Button>
                <br/>
                <AddGroupForm closeModal={closeAddGroupModal}/>
            </Modal>
        </div>
    )
}

DashboardGroupsList.propTypes = {};

export default DashboardGroupsList;
