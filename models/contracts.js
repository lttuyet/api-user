const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");

const findByTutor = async (id) => {
    try {
        const contracts = await dbs.production.collection('contracts').aggregate([
            { $match: { tutor: ObjectId(id), isDeleted: false } }, // lấy contracts của tutor chưa bị xóa
            {
                $lookup: {
                    from: 'users',
                    localField: 'learner',
                    foreignField: '_id',
                    as: 'learnerInfo'
                }
            }, // lấy thông tin người học
            {
                $project: {
                    _id: "$_id",
                    learner: {
                        name: "$learnerInfo.name",
                        image: "$learnerInfo.image",
                    },
                    comment: "$comment",
                    rate: "$rate",
                    status: "$status",
                    startDate: "$startDate",
                    endDate: "$endDate",
                    hours: "$hours"
                }
            } // Chọn trường
        ]).toArray();

        return contracts;
    } catch (e) {
        return [];
    }

};

const findByATutor = async (id,_role) => {
    try {
        const contracts = await dbs.production.collection('contracts').aggregate([
            { $match: { learner: ObjectId(id), isDeleted: false} }, // lấy contracts của tutor chưa bị xóa
            {
                $lookup: {
                    from: 'users',
                    localField: 'tutor',
                    foreignField: '_id',
                    as: 'learnerInfo'
                }
            }, // lấy thông tin người học
            {
                $project: {
                    _id: "$_id",
                    learner: {
                        name: "$learnerInfo.name",
                        image: "$learnerInfo.image",
                    },
                    comment: "$comment",
                    rate: "$rate",
                    status: "$status",
                    startDate: "$startDate",
                    endDate: "$endDate",
                    hours: "$hours"
                }
            } // Chọn trường
        ]).toArray();

        return contracts;
    } catch (e) {
        return [];
    }

};
exports.findByATutor = findByATutor;

exports.findByTutor = findByTutor;