const { Post } = require("../models/post.models");
const { User } = require("../models/users.models");

const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllPosts = async (req, resp) => {
  try {
    const allPosts = await Post.find();
    resp.json(allPosts);
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const friendPost = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const comentPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  // console.log(req.body);
  try {
    if (post) {
      await post.updateOne({ $push: { comments: req.body } });
      res.status(200);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const findByPost = async (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json({ message: "Id no encontrado" });
    });
};

const findUserPosts =  (req, res) => {
  const userId = req.params.userId;

  // Buscar todos los post de un usuario específico
  Post.find({ userId: userId })
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).send(error);
    });
};


module.exports = {
  friendPost,
  findUserPosts,
  createPost,
  getPost,
  likePost,
  comentPost,
  getAllPosts,
  findByPost,

};
