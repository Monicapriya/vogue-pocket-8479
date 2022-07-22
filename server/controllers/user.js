const nodemailer = require("nodemailer");
const userModel = require("../models/user");
const hbs = require("handlebars");
const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  secure: false,
  port: 587, //465:ssl , 587 :tsl
  auth: {
    user: "joshuah.denesik38@ethereal.email",
    pass: "XXxfeRFE1PXvPnUR1f",
  },
});

const userMail = async (req, res) => {
  const oldUser = await userModel.findOne({ mail: req.body.mail });
  if (!oldUser) {
    const newUser = new userModel({ ...req.body });
    await newUser.save();

    const content = `<div>
                            <h1>hello</h1>
                            <p>thank you for signing up, here is your {{otp}}</p>
                              </div>`;

    const template = hbs.compile(content);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const newOtp = await userModel.updateOne(
      { _id: newUser._id },
      { $push: { otp: otp } }
    );

    transport
      .sendMail({
        from: "from@example.com",
        to: "to@example.com",
        subject: "here is your otp.",
        // text: "hellow world 1234 monodb is good",
        html: template({ otp: otp }),
      })
      .then((responce) => {
        return res.send({
          message: "user signup successfully",
          id: newUser._id,
        });
      });
  } else {
    const content = `<div>
                                  <h1>hello</h1>
                                  <p>thank you for signing up, here is your {{otp}}</p>
                              </div>`;

    const template = hbs.compile(content);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const newOtp = await userModel.updateOne(
      { _id: oldUser._id },
      { $push: { otp: otp } }
    );

    transport
      .sendMail({
        from: "from@example.com",
        to: "to@example.com",
        subject: "here is your otp.",
        // text: "hellow world 1234 monodb is good",
        html: template({ otp: otp }),
      })
      .then((responce) => {
        return res.send({
          message: "user signup successfully",
          id: oldUser._id,
        });
      });
  }
};

async function userVerify(req, res) {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    const otpObj = await userModel.findOne({ _id: id });
    const otpArr = otpObj.otp;
    if (otpArr[otpArr.length - 1] === otp) {
      return res.send("your otp has been verified!");
    } else {
      return res.status(404).send("otp is wrong");
    }
  } catch (err) {
    console.log("err:", err);
    return res.status(404).send("Something went wrong");
  }
}
//62d7ce9fc8c9b354e8c3705b
module.exports = { userMail, userVerify };
