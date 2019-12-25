const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const tagModel = require("./tags");

module.exports.findByUser = async (_user) => {
  try {
    const userTag = await dbs.production.collection('user_tag').find({ user: ObjectId(_user), isDeleted: false }).toArray();
    var res = [];
    let i = 0;
    const n = userTag.length;

    for (i = 0; i < n; i++) {
      const tag = await tagModel.findById(userTag[i].tag);

      res.push(tag);
    }

    return res;
  } catch (e) {
    return false;
  }
};

module.exports.updateTagTutor = async (id, tags) => {
  try {
    const userTag = await dbs.production.collection('user_tag').find({ user: ObjectId(id), isDeleted: false }).toArray();

    await userTag.forEach((eUT) => {
      const exist = tags.findIndex((eT) => {
        return(eUT.tag == eT._id&&id==eUT.user.toString());
      });

      if (exist === -1) {
        dbs.production.collection('user_tag').updateOne({ _id: ObjectId(eUT._id)},
            {
              $set: {
                isDeleted: true
              }
            });
      } else {
        tags.splice(exist,1);
      }
    });

    await tags.forEach((element) => {
      const exist = userTag.findIndex((e) => {
        return(e.tag == element._id&&id==e.user.toString());
      });

      if (exist === -1) {
        const ut = {
          user: ObjectId(id),
          tag: ObjectId(element._id),
          isDeleted: false
        }

        dbs.production.collection("user_tag").insertOne(ut);
      } else {
        if (element.isDeleted) {
          dbs.production.collection('user_tag').updateOne({ tag: ObjectId(element._id), user: ObjectId(id), isDeleted: false},
            {
              $set: {
                isDeleted: false
              }
            });
        }
      }
    });

    return true;
  } catch (e) {
    return false;
  }
};