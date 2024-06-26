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
        // CEO
        {
            email: 'jorge.estevez@estevezjor.mx',
            password: bcrypt.hashSync('Estevez.ceo*', 10),
            fullName: 'Jorge Estévez Abreu',
            roles: ['ceo']
        },
        // General Director
        {
            email: 'fernanda.estevez@estevezjor.mx',
            fullName: 'Ma. Fernanda Estévez Gonzalez',
            password: bcrypt.hashSync('Estevez.director*', 10),
            roles: ['generalDirector']
        },
        // Directiors
        {
            email: 'ingrid.estevez@estevezjor.mx',
            fullName: 'Ingrid Martinez Baeza',
            password: bcrypt.hashSync('Estevez.director*', 10),
            roles: ['director']
        },
        {
            email: 'brandon.estevez@estevezjor.mx',
            fullName: 'Brandon Jhoan de Jesus Hernandez',
            password: bcrypt.hashSync('Estevez.director*', 10),
            roles: ['director']
        },
        {
            email: 'elizabeth.estevez@estevezjor.mx',
            fullName: 'Elizabeth Gonzalez Herrera',
            password: bcrypt.hashSync('Estevez.director*', 10),
            roles: ['director']
        }
    ]
};