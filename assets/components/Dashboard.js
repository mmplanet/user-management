import React, {useEffect, useState} from 'react'
import '../styles/dashboard.css';
import {useDispatch, useSelector} from "react-redux";
import {fetchUser, fetchUsers, setUserToken} from "../features/user/userSlice";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {Button, Container, Nav, Row, Table} from "react-bootstrap";
import Modal from 'react-modal';
import DashboardProfileForm from "./subcomponents/DashboardProfileForm";
import {confirmAlert} from 'react-confirm-alert';
import DashboardGroupsList from "./subcomponents/DashboardGroupsList";
import {apiDeleteUser} from "../app/InterNationsAPI";
import {fetchGroups} from "../features/group/groupSlice";
import AddUserForm from "./subcomponents/AddUserForm";
import {NotificationManager} from "react-notifications";
import OrganizeUser from "./subcomponents/OrganizeUser";

const Dashboard = () => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const userData = useSelector(state => state.user.userData);
    const allUsers = useSelector(state => state.user.allUsers);
    const allGroups = useSelector(state => state.group.allGroups);
    const [addUserModalIsOpen, setAddUserModalIsOpen] = React.useState(false);
    const [organizeModalIsOpen, setOrganizeModalIsOpen] = React.useState(false);
    const [organizeModalUser, setOrganizeModalUser] = React.useState(null);
    const [userTableData, setUserTableData] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate();

    const modalStyle = {
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

    useEffect(() => {
        if (cookies.token && userToken === null) {
            dispatch(fetchUser({token: cookies.token, userId: 'me'}))
            dispatch(setUserToken(cookies.token));
        }
    }, [cookies.token, userToken])

    useEffect(() => {
        if (userToken === null) {
            navigate("/");
        }
    }, [userToken])

    useEffect(() => {
        if (userData.hasOwnProperty('roles')) {
            setIsAdmin(userData.roles.includes("ROLE_ADMIN"))
        }
    }, [userData])

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchUsers({token: cookies.token}))
            dispatch(fetchGroups({token: cookies.token}))
        }
    }, [isAdmin])

    useEffect(() => {
        setUserTableData(allUsers)
    }, [allUsers])

    const deleteUser = (user) => {
        confirmAlert({
            title: `Delete user ${user.firstName} ${user.lastName}`,
            message: 'Are you sure to remove this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        apiDeleteUser({token: cookies.token, userId: user.id}).then(() => {
                            dispatch(fetchUsers({token: cookies.token}))
                            NotificationManager.info('User deleted.');
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

    const openAddUserModal = () => {
        setAddUserModalIsOpen(true);
    }

    const closeAddUserModal = () => {
        setAddUserModalIsOpen(false);
    }

    const openOrganizeModal = (user) => {
        setOrganizeModalUser(user);
        setOrganizeModalIsOpen(true);
    }

    const closeOrganizeModal = () => {
        setOrganizeModalIsOpen(false);
    }


    return (
        <div>
            {
                (userData.id !== undefined) &&
                <section className="mvh-75 pt-5 text-black">
                    <Container className="bg-white mb-3 mt-5">
                        <Row>
                            <DashboardProfileForm userData={userData}/>
                            {isAdmin && <DashboardGroupsList allGroups={allGroups}/>}
                        </Row>
                    </Container>
                    {
                        isAdmin &&
                        <Container className="bg-white">
                            <div className="col-12">
                                <Row>
                                    <div className="col-6">
                                        <h1 className="mb-3">Users</h1>
                                    </div>
                                    <div className="col-6">
                                        <Button className="btn-info add-user-btn" onClick={openAddUserModal}>
                                            Add User
                                        </Button>
                                    </div>
                                </Row>
                                <Row>
                                    <Table className="users-table">
                                        <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">First Name</th>
                                            <th scope="col">Last Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Roles</th>
                                            <th scope="col">Groups</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            userTableData.map(user => (
                                                <tr key={user.id}
                                                    className={user.id === userData.id ? 'self' : ''}>
                                                    <td scope="row">{user.id}</td>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        {user.roles.map((role, i) =>
                                                            (`${role}${i + 1 < user.roles.length ? ', ' : ''}`))
                                                        }
                                                    </td>
                                                    <td>
                                                        {user.groups.map((group, i) => {
                                                            return (`${group.name}${i + 1 < user.groups.length ? ', ' : ''}`)
                                                        })

                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            user.id !== userData.id && (
                                                                <Button
                                                                    onClick={() => deleteUser(user)}
                                                                    className="btn-danger me-1 mb-1">
                                                                    delete
                                                                </Button>
                                                            )
                                                        }
                                                        {allGroups.length > 0 &&
                                                            (
                                                                <Button
                                                                    onClick={() => openOrganizeModal(user)}
                                                                    className="btn-info mb-1">
                                                                    Organize
                                                                </Button>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>

                                    <Modal
                                        isOpen={addUserModalIsOpen}
                                        onRequestClose={closeAddUserModal}
                                        style={modalStyle}
                                        contentLabel="Add User"
                                    >
                                        <Button className="btn-danger"
                                                style={{float: "right"}}
                                                onClick={closeAddUserModal}>x
                                        </Button>
                                        <br/>
                                        <AddUserForm closeModal={closeAddUserModal}/>
                                    </Modal>

                                    <Modal
                                        isOpen={organizeModalIsOpen}
                                        onRequestClose={closeOrganizeModal}
                                        style={modalStyle}
                                        contentLabel="Add User"
                                    >
                                        <Button className="btn-danger"
                                                style={{float: "right"}}
                                                onClick={closeOrganizeModal}>x
                                        </Button>
                                        <br/>
                                        <OrganizeUser
                                            groups={allGroups}
                                            user={organizeModalUser}
                                            closeModal={closeOrganizeModal}
                                        />
                                    </Modal>
                                    <Nav aria-label="Table Pagination" className="justify-content-end">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#">Previous</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">2</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">3</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">Next</a>
                                            </li>
                                        </ul>
                                    </Nav>
                                </Row>
                            </div>
                        </Container>
                    }
                </section>
            }
        </div>
    )
}

Dashboard.propTypes = {};

export default Dashboard;
