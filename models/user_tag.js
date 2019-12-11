const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const tagModel = require("./tags");

module.exports.findByUser = async (_user) => {
  try{
    const userTag=  await dbs.production.collection('user_tag').find({ user: ObjectId(_user) }).toArray();
    var res=[];
    let i=0;
    const n=userTag.length;

    for(i=0;i<n;i++){
      const tag=await tagModel.findById(userTag[i].tag);

      res.push(tag);
    }

    return res;
  }catch(e){
    return false;
  }
};