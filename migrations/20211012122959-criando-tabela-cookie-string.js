module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('cookieStrings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      valor: {
        allowNull: false,
        type: DataTypes.STRING(),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('cookieStrings');
  }
};