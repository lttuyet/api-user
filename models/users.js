const { dbs } = require("../dbs");
const SALT_ROUNDS = 10;
const bcrypt = require("bcrypt");
const ObjectId = require('mongodb').ObjectId;

module.exports.findUserByTypeEmail = async (_type, _email) => {
    return await dbs.production.collection("users").findOne({
        type: _type,
        email: _email,
        isDeleted:false
    });
};

module.exports.findUserByIdFb = async (_idFb) => {
    return await dbs.production.collection("users").findOne({
        idFb: _idFb,
        isDeleted:false
    });
};

module.exports.findUserByIdGg = async (_idGg) => {
    return await dbs.production.collection("users").findOne({
        idGg: _idGg,
        isDeleted:false
    });
};

module.exports.findUserById = async (id) => {
    return await dbs.production.collection("users").findOne({_id:ObjectId(id)});
};

module.exports.insertUser = async (user, type) => {
    if (type === 'normal') {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        const newUser = {
            name: user.name,
            address: user.address,
            role: user.role,
            type: user.type,
            email: user.email,
            password: hash,
            isDeleted:false
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
            isDeleted:false
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
            isDeleted:false
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }
};

module.exports.updateInfoUser = async (user, info) => {

    return await dbs.production.collection('users').updateOne({ _id: ObjectId(user._id) },
        {
            $set: {
                name: info.name,
                image: info.image
            }
        });
}

module.exports.getDetails = async (id) => {
    try{
        return  await dbs.production.collection('users').findOne({_id:ObjectId(id)});
    }catch(e){
        return false;
    }
};

module.exports.updateBasic = async (id,data) => {

    return await dbs.production.collection('users').updateOne({ _id: ObjectId(id) },
        {
            $set: {
                name: data.name,
                address: data.address
            }
        });
}