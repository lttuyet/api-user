const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const userTagModel = require("./user_tag");

module.exports.getAll = async () => {
  return await dbs.production.collection("tags").find({ isDeleted: false }).toArray();
};

const findById = async (id) => {
  try {
    const res = await dbs.production.collection('tags').findOne({ _id: ObjectId(id) });

    return res;
  } catch (e) {
    return false;
  }

};
exports.findById = findById;