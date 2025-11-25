const ChamCongModel = (sequelize, DataTypes) => {
    const ChamCong = sequelize.define('ChamCong', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ma_nhan_vien: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'NhanVien',
                key: 'ma_nhan_vien'
            }
        },
        ngay_lam: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gio_vao: {
            type: DataTypes.TIME,
            allowNull: false
        },
        gio_ra: {
            type: DataTypes.TIME,
            allowNull: true // Cho phép NULL nếu là ca đang làm (chưa check-out)
        }
    }, {
        tableName: 'ChamCong',
        timestamps: false,
        
    });

    return ChamCong;
};

export default ChamCongModel;