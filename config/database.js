const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'postgres';

const sequelize = dialect === 'sqlite' 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './suivlima.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: dialect,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );

module.exports = sequelize;
