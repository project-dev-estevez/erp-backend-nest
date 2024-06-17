import * as bcrypt from 'bcrypt';

interface SeedUser {
    email: string;
    fullName: string;
    password: string;
    roles: string[];
}

interface SeedData {
    users: SeedUser[];
}

export const initialData: SeedData = {
    users: [
        {
            email: 'test1@google.com',
            fullName: 'Test User 1',
            password: bcrypt.hashSync('1passwordD', 10),
            roles: ['admin']
        },
        {
            email: 'test2@google.com',
            fullName: 'Test User 2',
            password: bcrypt.hashSync('1passwordD', 10),
            roles: ['user', 'super']
        }
    ]
};