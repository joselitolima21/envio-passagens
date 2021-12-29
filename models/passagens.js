module.exports = (sequelize, DataTypes) => {
    const Passagens = sequelize.define('passagens', {
      placa: DataTypes.STRING(7),
      idOriginal: DataTypes.STRING,
      tipoVeiculo: DataTypes.STRING(30),
      velocidade: DataTypes.DOUBLE,
      dataHora: DataTypes.STRING,
      idImagem: DataTypes.STRING(100),
      acertoImagem: DataTypes.DOUBLE,
      cameraNumero: DataTypes.STRING(15),
      cameraLatitude: DataTypes.DOUBLE,
      cameraLongitude: DataTypes.DOUBLE,
    });

    return Passagens;
  }