const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const userTagModel = require("./user_tag");

const findById = async (id) => {
  try{
    const res = await dbs.production.collection('tags').findOne({_id:ObjectId(id)});

    return res;
  }catch(e){
    return false;
  }
  
};
exports.findById = findById;