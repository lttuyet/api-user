const { dbs } = require("../dbs");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports.findLearnerByEmail = async (_email) => {
  return await dbs.production.collection("learners").findOne({ email: _email });
};

module.exports.insertLearner = async (learner) => {
    const hash = await bcrypt.hash(learner.password, SALT_ROUNDS);
  
    const newLearner = {
      name:learner.name,
      address:learner.address,
      email:learner.email,
      password:hash
    };
  
    return await dbs.production.collection("learners").insertOne(newLearner);
  };