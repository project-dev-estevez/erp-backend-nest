import { DIRECTIONS_DATA } from './directions-data';
import { ENTERPRISES_DATA } from './enterprises-data';
import { USERS_DATA } from './users-data';

interface SeedUser {
    email: string;
    fullName: string;
    password: string;
    roles: string[];
}

interface SeedEnterprise {
    name: string;
}

interface SeedDirection {
    name: string;
    isGeneralDirection: boolean;
}

interface SeedData {
    users: SeedUser[];
    enterprises: SeedEnterprise[];
    directions: SeedDirection[];
}

export const initialData: SeedData = {
    users: USERS_DATA,
    enterprises: ENTERPRISES_DATA,
    directions: DIRECTIONS_DATA
};