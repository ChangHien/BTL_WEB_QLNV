const PhongBanModel = (sequelize, DataTypes) => {
  const PhongBan = sequelize.define('PhongBan', {
    ma_phong: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
      allowNull: false
    },
    ten_phong: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'PhongBan',
    timestamps: false
  });
  return PhongBan;
};

export default PhongBanModel;