import db from "./models/index.js";

db.sequelize
  .sync()
  .then(() => {
    console.log(" database connected");
    app.listen(process.env.PORT, () => {
      console.log(` server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(" database error:", err);
  });