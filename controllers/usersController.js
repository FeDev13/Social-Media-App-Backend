const User = require("../models/users.models");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// module.exports.register = async (req, res) => {
//   // const url = req.protocol + "://" + req.get("host");
//   // const urlImage = url + "/upload/" + req.file.filename;
//   const modelData = {
//     username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 10)
//   };

//   const user = new User(modelData);
//   user.save();
//   res.json(user);
// };

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, avatarImage } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      _id,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUsers = async (req, res) => {
  const user = await User.find();
  res.json(user);
};

module.exports.findByUser = async (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json({ message: "Id no encontrado" });
    });
};

module.exports.findByFollowers = async (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      res.json(data.followers);
    })
    .catch(() => {
      res.json({ message: "Id no encontrado" });
    });
};


module.exports.findByFollowing = async (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      res.json(data.following);
    })
    .catch(() => {
      res.json({ message: "Id no encontrado" });
    });
};

module.exports.likePost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.likes.includes(req.body.userId)) {
      await user.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The user has been liked");
    } else {
      await user.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The user has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// Follow a user
module.exports.FollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.followers.push(req.body.follower);
    await user.save();

    const follower = await User.findById(req.body.follower);
    follower.following.push(req.params.id);
    await follower.save();

    res.send({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Unfollow a user
module.exports.UnfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.followers.remove(req.body.follower);
    await user.save();

    const follower = await User.findById(req.body.follower);
    follower.following.remove(req.params.id);
    await follower.save();

    res.send({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const url = req.protocol + "://" + req.get("host");
  const urlImage = url + "/upload/" + req.file.filename;
  let modelData = {
    username: req.body.username,
    background: urlImage,
    descripcion: req.body.descripcion,
  };
  await User.updateOne({ _id: id }, modelData);
  res.json({ message: "Usuario Modificado" });
};
