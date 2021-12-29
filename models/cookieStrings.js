module.exports = (sequelize, DataTypes) => {
    const CookieStrings = sequelize.define('cookieStrings', {
      valor: DataTypes.STRING()
    });

    return CookieStrings;
  }