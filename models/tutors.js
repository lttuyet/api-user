const { dbs } = require("../dbs");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports.findTutorByEmail = async (_email) => {
  return await dbs.production.collection("tutors").findOne({ email: _email });
};

module.exports.insertTutor = async (tutor) => {
    const hash = await bcrypt.hash(tutor.password, SALT_ROUNDS);
  
    const newTutor = {
      name:tutor.name,
      address:tutor.address,
      email:tutor.email,
      password:hash
    };
  
    return await dbs.production.collection("tutors").insertOne(newTutor);
  };