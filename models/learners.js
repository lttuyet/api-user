const { dbs } = require("../dbs");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports.findLearnerByEmailType = async (_email,_type) => {
  return await dbs.production.collection("learners").findOne({ 
    email: _email, 
    type: _type
  });
};

module.exports.insertLearner = async (learner,type) => {
    const hash = await bcrypt.hash(learner.password, SALT_ROUNDS);
  
    const newLearner = {
      name:learner.name,
      address:learner.address,
      email:learner.email,
      password:hash,
      type:type
    };
  
    return await dbs.production.collection("learners").insertOne(newLearner);
  };