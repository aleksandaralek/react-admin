import { AuthProvider, HttpError } from 'react-admin';
import data from './users.json';

export const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        const user = data.users.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            let { password, ...userToPersist } = user;
            localStorage.setItem('user', JSON.stringify(userToPersist));
            return Promise.resolve();
        }

        return Promise.reject(
            new HttpError('Unauthorized', 401, {
                message: 'Invalid username or password',
            })
        );
    },
    logout: () => {
        localStorage.removeItem('user');
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        localStorage.getItem('user') ? Promise.resolve() : Promise.reject(),
    getPermissions: () => Promise.reject('Unknown method'),
    getIdentity: () => {
        const persistedUser = localStorage.getItem('user');
        const user = persistedUser ? JSON.parse(persistedUser) : null;

        return Promise.resolve(user);
    },
};

export default authProvider;
