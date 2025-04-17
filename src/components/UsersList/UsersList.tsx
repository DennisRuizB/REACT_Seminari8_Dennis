import React, { useState, useEffect } from "react";
import { User } from '../../types';
import styles from './UsersList.module.css'; // Import CSS module
import UpdateUser from '../UpdateUser/UpdateUser'; // Import the UpdateUser component
import { fetchUsers } from "../../services/usersService";

interface Props {
    users: User[];
}

const UsersList: React.FC<Props> = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [updatedUsers, setUpdatedUsers] = useState<User[]>(users);
    const [shouldReload, setShouldReload] = useState(false); // Estado para controlar la recarga

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUpdatedUsers(fetchedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                setUpdatedUsers([]);
            }
        };
        loadUsers();
    }, [shouldReload]); // Ejecuta el efecto cuando cambia `shouldReload`

    const handleUserClick = (user: User) => {
        setSelectedUser(user); // Set the selected user
    };

    const handleBackClick = () => {
        setSelectedUser(null); // Clear the selected user to go back to the list
        setShouldReload((prev) => !prev); // Cambia el estado para forzar la recarga
    };

    if (selectedUser) {
        return (
            <div>
                <UpdateUser user={selectedUser} />
                <button onClick={handleBackClick} className={styles.backButton}>
                    Volver
                </button>
            </div>
        );
    }

    return (
        <ul className={styles.list}>
            {updatedUsers.map((user) => (
                <li
                    key={user.name}
                    className={styles.listItem}
                    onClick={() => handleUserClick(user)} // Set the selected user on click
                >
                    <div className={styles.userInfo}>
                        <h2 className={styles.user}>{user.name}</h2>
                        <h3 className={styles.age}>Age: {user.age}</h3>
                        <p className={styles.email}>{user.email}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default UsersList;