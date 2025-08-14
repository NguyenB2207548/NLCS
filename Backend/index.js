const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const carRouter = require("./routes/car");
const rentalRouter = require("./routes/rental");
const payRouter = require("./routes/pay");
const brandRouter = require("./routes/brand");
const adminUser = require("./routes/admin/adminUser");
const adminCar = require("./routes/admin/adminCar");
const adminContract = require("./routes/admin/adminContract");
const statsRouter = require("./routes/stats");
const notificationRouter = require("./routes/notification");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
  });
});

function sendNotification(userId, message) {
  const socketId = onlineUsers[userId];
  //   console.log(socketId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
  }
}

app.use((req, res, next) => {
  req.io = io;
  req.sendNotification = sendNotification;
  next();
});

// Routers
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/rental", rentalRouter);
app.use("/pay", payRouter);
app.use("/brand", brandRouter);
app.use("/stats", statsRouter);
app.use("/admin/user", adminUser);
app.use("/admin/car", adminCar);
app.use("/admin/contract", adminContract);
app.use("/notification", notificationRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
