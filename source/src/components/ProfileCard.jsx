import defaultProfileImage from '../assets/taxi_icon.png';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import Input from './Input';
import {ButtonWithProgress} from './ButtonWithProgress';
import {deleteUser, updateUser} from '../api/apiCalls';
import Modal from './Modal';
import {useNavigate} from 'react-router-dom';
import {logoutSuccess, updateSuccess} from '../state/authActions';

const ProfileCard = (props) => {
    const [inEditMode, setEditMode] = useState(false);
    const [deleteApiProgress, setDeleteApiProgress] = useState(false);
    const [updateApiProgress, setUpdateApiProgress] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const {user} = props;
    const [newUsername, setNewUsername] = useState(user.username);

    const {id, username} = useSelector((store) => ({
        id: store.id,
        username: store.username,
        header: store.header
    }));

    const onClickSave = async () => {
        setUpdateApiProgress(true);
        try {
            await updateUser(id, {username: newUsername});
            setEditMode(false);
            dispatch(
                updateSuccess({
                    username: newUsername
                })
            );
        } catch (error) {
        }
        setUpdateApiProgress(false);
    };

    const onClickCancel = () => {
        setEditMode(false);
        setNewUsername(username);
    };
    const onClickDelete = async () => {
        setDeleteApiProgress(true);
        try {
            await deleteUser(id);
            navigate('/');
            dispatch(logoutSuccess());
        } catch (error) {
        }

        setDeleteApiProgress(false);
    };

    let content;

    if (inEditMode) {
        content = (
            <>
                <Input
                    label="Change your username"
                    id="username"
                    initialValue={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                />
                <ButtonWithProgress
                    onClick={onClickSave}
                    apiProgress={updateApiProgress}
                >
                    Save
                </ButtonWithProgress>{' '}
                <button className="btn btn-outline-secondary"
                        onClick={onClickCancel}
                >
                    Cancel
                </button>
            </>
        );
    } else {
        content = (
            <>
                <h3>{newUsername}</h3>
                {user.id === id && (
                    <>
                        <div>
                            <button
                                className="btn btn-outline-success"
                                onClick={() => setEditMode(true)}
                            >
                                Edit
                            </button>
                        </div>
                        <div className="pt-2">
                            <button
                                className="btn btn-danger"
                                onClick={() => setModalVisible(true)}
                            >
                                Delete My Account
                            </button>
                        </div>
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <div className="card text-center">
                <div className="card-header">
                    <img
                        src={defaultProfileImage}
                        alt="profile"
                        width="200"
                        height="200"
                        className="rounded-circle shadow"
                    />
                </div>
                <div className="card-body">{content}</div>
            </div>
            {modalVisible && (
                <Modal
                    content="Are you sure to delete your account?"
                    onClickCancel={() => setModalVisible(false)}
                    onClickConfirm={onClickDelete}
                    apiProgress={deleteApiProgress}
                />
            )}
        </>
    );
};
export default ProfileCard;
