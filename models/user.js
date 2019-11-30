const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const SALT_ROUNDS = 10;
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");

module.exports.findUserByEmail = async (_email) => {
  return await dbs.production.collection("users").findOne({ email: _email });
};

module.exports.findUserById = async (id) => {
  return await dbs.production.collection("users").findOne({ _id: ObjectId(id) });
};

module.exports.insertUser = async (user) => {
  const hash = await bcrypt.hash(user.password, SALT_ROUNDS);

  const newUser = {
    name:user.name,
    email:user.email,
    picture:"",
    password:hash
  };

  return await dbs.production.collection("users").insertOne(newUser);
};

module.exports.updateInfoUser = async (user, newInfo) => {
  return await dbs.production.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        name: newInfo.name
      }
    }
  );
};

module.exports.updateImageUser = async (user, newInfo) => {
  return await dbs.production.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        picture: newInfo.picture
      }
    }
  );
};

module.exports.changePasswordUser = async (user,newPassword) => {
  const newHashPass = await bcrypt.hash(newPassword, SALT_ROUNDS);

  return await dbs.production.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        password: newHashPass
      }
    }
  );
};








exports.getUserByAccount = function (account) {
  return dbs.production.collection("users").findOne({ account: account });
};

exports.comparePassword = function (candidatePassword, hash) {
  return bcrypt.compare(candidatePassword, hash);
};

exports.getUserById = function (id) {
  return dbs.production.collection("users").findById(id);
};


const detail = async id => {
  const results = await dbs.production
    .collection("users")
    .find({ _id: ObjectId(id) })
    .toArray();
  return results[0];
};

exports.detail = detail;
