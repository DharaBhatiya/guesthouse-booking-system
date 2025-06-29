const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/booking");
const publicRoutes = require("./routes/public");
const paymentRoutes = require("./routes/payment");

const { verifyToken } = require("./middlewares/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);


app.use("/api/admin", verifyToken, adminRoutes);
app.use("/api/bookings", verifyToken, bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message || "Unknown error"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on the port ${process.env.PORT}`);
});