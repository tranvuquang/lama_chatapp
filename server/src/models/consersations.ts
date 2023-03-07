module.exports = (sequelize: any, DataTypes: any) => {
  const conversations = sequelize.define("conversations", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
    },
  });

  // Users.associate = (models: any) => {
  //   Users.hasMany(models.Likes, {
  //     onDelete: "cascade",
  //   });

  //   Users.hasMany(models.Posts, {
  //     onDelete: "cascade",
  //   });
  // };

  return conversations;
};
