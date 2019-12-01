const tutorModel = require("../models/tutors");

exports.registerPost = async (req, res) => {
  const _email = await tutorModel.findTutorByEmail(req.body.email);
  
  if (_email) {
    return res.json({
      status: 444,
      message: "existed email"
    });
  } else {
    await tutorModel.insertTutor(req.body);
    
    return res.json({
      message: "success"
    });
  }
};