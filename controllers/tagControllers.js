const tagModel = require("../models/tags");

exports.getAll = async (req, res) => {
    const allTags = await tagModel.getAll();

    if (allTags) {
        return res.json({
            status: "success",
            allTags: allTags
        });
    } else {
        return res.json({
            status: "failed",
            message: "get all tags failed"
        });
    }
};