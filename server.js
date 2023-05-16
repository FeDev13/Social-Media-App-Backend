require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const postRoutes = require("./routes/posts.route");
const app = express();
const socket = require("socket.io");

const multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(express.static(__dirname));
app.use("/users", authRoutes);
app.use("/messages", messageRoutes);
app.use(postRoutes);
app.use("/images", express.static(path.join(__dirname, "public/images")));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
app.get("/", (request, response) => {
  response.send("<h1>Home</h1>");
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
mongoose.set("strictPopulate", false);
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("archivo subido correctamente");
  } catch (error) {
    console.error(error);
  }
});

// const express = require("express");
// const mongose = require("mongoose");
// const puertoMongo = process.env.LOCALHOST;
// const app = express();
// const socket = require("socket.io");
// const cors = require("cors");
// require("dotenv").config();
// /**Cadena conexion con mongo */

// mongose
//   .connect(puertoMongo)
//   .then(() => console.log("Connect MongoDB"))
//   .catch((err) => {
//     console.error(err);
//   });
// /**Fin de cadena conexion */
// const routerU = require("./routes/users.route");
// const routerPosts = require("./routes/posts.route");
// const routerMessages = require("./routes/messages");

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(routerU);
// app.use(routerPosts);
// app.use(routerMessages);
// app.use(express.static(__dirname));

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor corriendo por el puerto` + " " + process.env.PORT);
// });

// const server = app.listen(process.env.PORT, () =>
//   console.log(`Server started on ${process.env.PORT}`)
// );

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });
