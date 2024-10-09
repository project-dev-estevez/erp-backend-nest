import { DIRECTIONS_DATA } from './directions-data';
import { ENTERPRISES_DATA } from './enterprises-data';
import { USERS_DATA } from './users-data';
import { DEPARTMENTS_DATA } from './departments-data';

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

interface SeedDepartment {
    name: string;
}

interface SeedData {
    users: SeedUser[];
    enterprises: SeedEnterprise[];
    directions: SeedDirection[];
    departments: SeedDepartment[];
}

export const initialData: SeedData = {
    users: USERS_DATA,
    enterprises: ENTERPRISES_DATA,
    directions: DIRECTIONS_DATA,
    departments: DEPARTMENTS_DATA
};