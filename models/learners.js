const { dbs } = require("../dbs");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports.findLearnerByEmailType = async (_email, _type) => {
  return await dbs.production.collection("learners").findOne({
    email: _email,
    type: _type
  });
};

module.exports.findLearnerByIdFb = async (_idFb) => {
  return await dbs.production.collection("learners").findOne({
    idFb: _idFb
  });
};

module.exports.findLearnerById = async (id) => {
  return await dbs.production.collection("learners").findOne({
    _id: id
  });
};

module.exports.insertLearner = async (learner, type) => {
  if (type === 'normal') {
    const hash = await bcrypt.hash(learner.password, SALT_ROUNDS);
    const newLearner = {
      name: learner.name,
      address: learner.address,
      email: learner.email,
      password: hash,
      type: type
    };

    return await dbs.production.collection("learners").insertOne(newLearner);
  }

  if (type === 'facebook') {
    const newLearner = {
      name: learner.name,
      address: learner.address,
      email: learner.email,
      idFb: learner.idFb,
      type: type
    };

    return await dbs.production.collection("learners").insertOne(newLearner);
  }

  if (type === 'google') {
    const newLearner = {
      name: learner.name,
      address: learner.address,
      email: learner.email,
      type: type
    };

    return await dbs.production.collection("learners").insertOne(newLearner);
  }

  return null;
};

module.exports.updateInfoLearner = async (learner, info) => {

  return await dbs.production.collection('learners').updateOne({ _id: learner._id },
    {
      $set: {
        name: info.name,
        address: info.address
      }
    });
}