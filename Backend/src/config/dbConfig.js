import 'dotenv/config'; 

const dbConfig = {
    HOST: "localhost",
    USER: "root",
    PORT: 3306,
    PASSWORD: '0375598674h', 
    DB: "qlnv",
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default dbConfig;