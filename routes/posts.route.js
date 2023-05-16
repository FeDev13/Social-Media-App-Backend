const express = require("express");
const routerPost = express.Router();

const {
  findUserPosts,
  createPost,
  getPost,
  likePost,
  comentPost,
  getAllPosts,
  findByPost,
} = require("../controllers/postsController");

routerPost.post("/posts/", createPost);
routerPost.get("/posts/", getAllPosts);
routerPost.get("posts/:username", getPost);
// routerPost.get("/posts/:id", friendPost);
routerPost.get("/postss/:id", findByPost);
routerPost.put("/posts/:id/like", likePost);
routerPost.put("/posts/:id/comment", comentPost);
routerPost.get("/posts/:userId", findUserPosts);

module.exports = routerPost;
