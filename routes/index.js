const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const couponRoute = require("./couponRoute");
const orderRoute = require("./orderRoute");
const homepageImageRoute = require("./homepageImageRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/homepage-images", homepageImageRoute);
};

module.exports = mountRoutes;
