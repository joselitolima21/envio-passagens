module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('passagens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      idOriginal: {
        allowNull: true,
        type: DataTypes.STRING(),
        unique: true
      },
      placa: {
        allowNull: false,
        type: DataTypes.STRING(7),
      },
      tipoVeiculo: {
        allowNull: true,
        type: DataTypes.STRING(30),
      },
      velocidade: {
        allowNull: true,
        type: DataTypes.DOUBLE,
      },
      dataHora: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      idImagem: {
        allowNull: true,
        type: DataTypes.STRING(100),
      },
      acertoImagem: {
        allowNull: true,
        type: DataTypes.DOUBLE,
      },
      cameraNumero: {
        allowNull: false,
        type: DataTypes.STRING(),
      },
      cameraLatitude: {
        allowNull: true,
        type: DataTypes.DOUBLE,
      },
      cameraLongitude: {
        allowNull: true,
        type: DataTypes.DOUBLE,
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
    return queryInterface.dropTable('passagens');
  }
};