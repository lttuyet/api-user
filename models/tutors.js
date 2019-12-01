const { dbs } = require("../dbs");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports.findTutorByEmailType = async (_email, _type) => {
  return await dbs.production.collection("tutors").findOne({
    email: _email,
    type: _type
  });
};

module.exports.findTutorByIdFb = async (_idFb) => {
  return await dbs.production.collection("tutors").findOne({
    idFb: _idFb
  });
};

module.exports.insertTutor = async (tutor,type) => {
  if (type === 'normal') {
    const hash = await bcrypt.hash(tutor.password, SALT_ROUNDS);

    const newTutor = {
      name: tutor.name,
      address: tutor.address,
      email: tutor.email,
      password: hash,
      type: type
    };

    return await dbs.production.collection("tutors").insertOne(newTutor);
  }

  if (type === 'facebook') {
    const newTutor = {
      name: tutor.name,
      address: tutor.address,
      email: tutor.email,
      idFb: tutor.idFb,
      type: type
    };

    return await dbs.production.collection("tutors").insertOne(newTutor);
  }

  if (type === 'google') {
    const newTutor = {
      name: tutor.name,
      address: tutor.address,
      email: tutor.email,
      type: type
    };

    return await dbs.production.collection("tutors").insertOne(newTutor);
  }

  return null;
};