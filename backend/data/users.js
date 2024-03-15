import bcrypt from "bcryptjs";

const users = [
    {
        name: 'admin user',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true,
    },
    {
        name: 'ranadom1',
        email: 'random1@gmail.com',
        password: bcrypt.hashSync('1234567',10),
        isAdmin: false,
    },
    {
        name: 'ranadom2',
        email: 'random2@gmail.com',
        password: bcrypt.hashSync('1234567',10),
        isAdmin: false,
    },
    {
        name: 'ranadom3',
        email: 'random3@gmail.com',
        password: bcrypt.hashSync('1234567',10),
        isAdmin: false,
    },
    {
        name: 'ranadom4',
        email: 'random4@gmail.com',
        password: bcrypt.hashSync('1234567',10),
        isAdmin: false,
    },
    
];
export default users;