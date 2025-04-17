import React, { useReducer } from 'react';
import { User } from '../../types';
import styles from './UpdateUser.module.css';
import { updateUser } from '../../services/usersService';

interface UpdateUserProps {
    user: User; // El usuario que se va a actualizar, incluyendo su ID
}

const INITIAL_STATE: User = {
    name: '',
    age: 0,
    email: '',
    password: '',
    phone: 0,
};

type FormReducerAction =
    | {
          type: 'change_value';
          payload: {
              inputName: keyof User;
              inputValue: string | number;
          };
      }
    | { type: 'clear' };

const formReducer = (state: User, action: FormReducerAction): User => {
    switch (action.type) {
        case 'change_value':
            return {
                ...state,
                [action.payload.inputName]: action.payload.inputValue,
            };
        case 'clear':
            return INITIAL_STATE;
        default:
            return state;
    }
};

const UpdateUser: React.FC<UpdateUserProps> = ({ user }) => {
    const [inputValues, dispatch] = useReducer(formReducer, user);

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            // Asegúrate de que el ID del usuario está presente
            if (!inputValues._id) {
                console.log(inputValues);

                alert('User ID is required to update the user.');
                return;
            }

            // Llama al servicio para actualizar el usuario
            const updatedUser = await updateUser(inputValues);
            console.log('User updated:', updatedUser);
            alert('User updated successfully!');
            dispatch({ type: 'clear' });
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        dispatch({
            type: 'change_value',
            payload: {
                inputName: name as keyof User,
                inputValue: name === 'age' || name === 'phone' ? Number(value) : value,
            },
        });
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        onChange={handleChange}
                        value={inputValues.name}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="age" className={styles.label}>
                        Age
                    </label>
                    <input
                        onChange={handleChange}
                        value={inputValues.age || ''}
                        type="number"
                        name="age"
                        id="age"
                        placeholder="Enter your age"
                        className={styles.input}
                        required
                        min="0"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        onChange={handleChange}
                        value={inputValues.email}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        onChange={handleChange}
                        value={inputValues.password}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'clear' })}
                        className={styles.button}
                    >
                        Clear
                    </button>
                    <button type="submit" className={styles.button}>
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;