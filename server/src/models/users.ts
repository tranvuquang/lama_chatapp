module.exports = (sequelize: any, DataTypes: any) => {
  const users = sequelize.define("users", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  users.associate = (models: any) => {
    users.belongsTo(models.conversations, {
      onDelete: "cascade",
      foreignKey: "id",
    });

  };

  return users;
};
