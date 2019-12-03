const { dbs } = require("../dbs");
const SALT_ROUNDS = 10;
const bcrypt = require("bcrypt");
const ObjectId = require('mongodb').ObjectId;

module.exports.findUserByTypeEmail = async (_type, _email) => {
    return await dbs.production.collection("users").findOne({
        type: _type,
        email: _email
    });
};

module.exports.findUserByIdFb = async (_idFb) => {
    return await dbs.production.collection("users").findOne({
        idFb: _idFb
    });
};

module.exports.findUserByIdGg = async (_idGg) => {
    return await dbs.production.collection("users").findOne({
        idGg: _idGg
    });
};

module.exports.findUserById = async (id) => {
    return await dbs.production.collection("users").findById(id);
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
            password: hash
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }

    if (type === 'facebook') {
        const newUser = {
            name: user.name,
            address: user.address,
            role: user.role,
            type: user.type,
            email: user.email,
            idFb: user.idFb,
            image: user.image,
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }

    if (type === 'google') {
        const newUser = {
            name: user.name,
            address: user.address,
            role: user.role,
            type: user.type,
            email: user.email,
            idGg: user.idGg,
            image: user.image
        };

        return await dbs.production.collection("users").insertOne(newUser);
    }
};

module.exports.updateInfoUser = async (user, info) => {

    return await dbs.production.collection('users').updateOne({ _id: ObjectId(user._id) },
        {
            $set: {
                name: info.name,
                address: info.address,
                image: info.image
            }
        });
}