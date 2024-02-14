const express = require('express');

const router = express.Router();

router.get("/status", function(req, res) {
  res.send(AppController.getStatus)
});

router.get("/stats", function(req, res) {
  res.send(AppController.getStats);
});

router.post("/users", function(req, res) {
  res.send(UsersController.postNew);
});

router.get("/connect", function(req, res) {
  res.send(AuthController.getConnect);
});

router.get("/disconnect", function(req, res) {
  res.send(AuthController.getDisconnect);
});

router.get("/users/me", function(req, res) {
  res.send(UserController.getMe);
});

router.post("/files", function(req, res) {
  res.send(FilesController.postUpload);
});

router.get("/files/:id", function(req, res) {
  res.send(FilesController.getShow);
});

router.get("/files", function(req, res) {
  res.send(FilesController.getIndex);
});

router.put("/files/:id/publish", function(req, res) {
  res.send(FilesController.putPublish);
});

router.put("/files/:id/unpublish", function(req, res) {
  res.send(FilesController.putUnpublish);
});

router.get("/files/:id/data", function(req, res) {
  res.send(FilesController.getFile);
});

module.exports = router;
