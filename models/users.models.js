const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  descripcion:{
    type: String,
    default: "",
  },
  background: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png",
  },
});

module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     min: 3,
//     max: 20,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     max: 50,
//   },
//   password: {
//     type: String,
//     required: true,
//     min: 8,
//   },
//   isAvatarImageSet: {
//     type: Boolean,
//     default: false,
//   },
//   likes: {
//     type: Array,
//     default: []
// },
//   avatarImage: {
//     type: String,
//     default: "",
//   },
// });

// const FollowSchema = new mongoose.Schema({
//   follower: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   following: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   }
// });

// module.exports = { User: mongoose.model("User", userSchema), Follow: mongoose.model("Follow", FollowSchema) };

// module.exports = {
//   User,
//   Follow,
// }
