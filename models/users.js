const { dbs } = require("../dbs");
const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");
const ObjectId = require('mongodb').ObjectId;

// --------------------Lấy danh sách typical tutors--------------------
module.exports.getTypicalTutors = async () => {
    // match dùng để lọc dữ liệu theo các trường
    const typicalTutors = await dbs.production.collection('users').aggregate([
        { $match: { role: "tutor", isDeleted: false,isblocked:false,isActivated:true  } },
        {
            $lookup: {
                from: 'contracts',
                localField: '_id',
                foreignField: 'tutor',
                as: 'tutor_contracts'
            }
        },
        {
            $project: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                intro: "$intro",
                price: "$price",
                address: "$address",
                numOfContracts: { $size: "$tutor_contracts" }
            }
        },
        {
            $sort: { numOfContracts: -1 }
        },
        {
            $limit: 3
        },
        {
            $lookup: {
                from: 'user_tag',
                localField: '_id',
                foreignField: 'user',
                as: 'tutorTag'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tutorTag.tag',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $project: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                intro: "$intro",
                price: "$price",
                address: "$address",
                numOfContracts: "$numOfContracts",
                tags: "$tags.name"
            }
        }
    ]).toArray();

    return typicalTutors;
}

module.exports.getListTutors = async () => {
    const tutors = await dbs.production.collection('users').aggregate([
        { $match: { role: "tutor", isDeleted: false,isblocked:false,isActivated:true } }, // match dùng để lọc dữ liệu theo các trường
        {
            $lookup: {
                from: 'contracts',
                localField: '_id',
                foreignField: 'tutor',
                as: 'tutor_contracts'
            }
        }, // Lấy danh sách hợp đồng
        {
            $project: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                intro: "$intro",
                price: "$price",
                address: "$address",
                numOfContracts: { $size: "$tutor_contracts" }
            }
        }, // Tính số hợp đồng
        {
            $sort: { numOfContracts: -1 }
        }, // Sắp xếp theo phổ biến // bỏ qua skip tutors
        {
            $lookup: {
                from: 'user_tag',
                localField: '_id',
                foreignField: 'user',
                as: 'tutorTag'
            }
        }, // Lấy danh sách mã tags
        {
            $lookup: {
                from: 'tags',
                localField: 'tutorTag.tag',
                foreignField: '_id',
                as: 'tags'
            }
        }, // Lấy danh sách tags
        {
            $project: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                intro: "$intro",
                price: "$price",
                address: "$address",
                numOfContracts: "$numOfContracts",
                tags: "$tags.name"
            }
        } // Chọn trường
    ]).toArray();

    return tutors;
}















// --------------------find---------------------------------
module.exports.findUserByTypeEmail = async (_type, _email) => {
    return await dbs.production.collection("users").findOne({
        type: _type,
        email: _email.toLowerCase(),
        isDeleted: false
    });
};

module.exports.findUserByEmail = async (_email) => {
    return await dbs.production.collection("users").findOne({
        email: _email.toLowerCase(),
        isDeleted: false
    });
};

module.exports.findUserByIdFb = async (_idFb) => {
    return await dbs.production.collection("users").findOne({
        idFb: _idFb,
        isDeleted: false
    });
};

module.exports.findUserByIdGg = async (_idGg) => {
    return await dbs.production.collection("users").findOne({
        idGg: _idGg,
        isDeleted: false
    });
};

module.exports.findUserById = async (id) => {
    return await dbs.production.collection("users").findOne({ _id: ObjectId(id) ,isDeleted: false});
};

module.exports.getDetails = async (id) => {
    try {
        return await dbs.production.collection('users').findOne({ _id: ObjectId(id),isDeleted: false,isblocked:false,isActivated:true  });
    } catch (e) {
        return false;
    }
};


// ------------------------insert-------------------------------
module.exports.insertUser = async (user, type,secretToken) => {
    if (type === 'normal') {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        const newUser = {
            name: user.name,
            address: user.address,
            role: user.role,
            type: user.type,
            email: user.email.toLowerCase(),
            password: hash,
            isDeleted: false,
            isblocked:false,
            isActivated:false,
            veryfyCode:secretToken
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }

    if (type === 'facebook') {
        const newUser = {
            name: user.name,
            role: user.role,
            type: user.type,
            email: user.email,
            idFb: user.idFb,
            image: user.image,
            isDeleted: false,
            isblocked:false,
            isActivated:false,
            veryfyCode:""
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }

    if (type === 'google') {
        const newUser = {
            name: user.name,
            role: user.role,
            type: user.type,
            email: user.email,
            idGg: user.idGg,
            image: user.image,
            isDeleted: false,
            isblocked:false,
            isActivated:false,
            veryfyCode:""
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }
};

// --------------------------update-------------------------------
module.exports.updateInfoUser = async (user, info) => {

    return await dbs.production.collection('users').updateOne({ _id: ObjectId(user._id),isDeleted: false,isblocked:false,isActivated:true  },
        {
            $set: {
                name: info.name,
                image: info.image
            }
        });
}

module.exports.updateBasic = async (id, data) => {
    return await dbs.production.collection('users').updateOne({ _id: ObjectId(id),isDeleted: false,isblocked:false,isActivated:true  },
        {
            $set: {
                name: data.name,
                address: data.address
            }
        });
}

module.exports.updateImage = async (id, _image) => {
    return await dbs.production.collection('users').updateOne({ _id: ObjectId(id),isDeleted: false,isblocked:false,isActivated:true  },
        {
            $set: {
                image: _image
            }
        });
}

module.exports.updateVerifyCode = async (id, veryfyCode) => {
    return await dbs.production.collection('users').updateOne({ _id: ObjectId(id),isDeleted: false,isblocked:false,isActivated:false },
        {
            $set: {
                veryfyCode:updateVerifyCode
            }
        });
}



module.exports.getDetailsTutor = async (id) => {
    const tutor = await dbs.production.collection('users').findOne({ _id: ObjectId(id), role: "tutor", isDeleted: false,isblocked:false,isActivated:true });

    return tutor;
}

