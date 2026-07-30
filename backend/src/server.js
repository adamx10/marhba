import { sequelize } from "./models/index.js";

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server running...");
  });
});