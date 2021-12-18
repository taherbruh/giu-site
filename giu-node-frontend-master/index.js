const Sequelize = require("sequelize");
const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const { QueryTypes } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:01008372823@localhost:5432/giu"
);
const app = express();

const router = express.Router();

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/giu.html"));
  //__dirname : It will resolve to your project folder.
});
router.get("/application", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/application.html"));
  //__dirname : It will resolve to your project folder.
});
// create application/json parser
var jsonParser = bodyParser.json();

async function main() {
  // Authenticate to postgresql
  await sequelize.authenticate();
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(express.static(__dirname + "/views"));
  app.use("/", router);
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

main();

app.post("/create/student", jsonParser, async (req, res) => {
  try {
      console.log(req.body)
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var country = req.body.country;
    var country_code = req.body.country_code;
    var local = req.body.local;
    var state_code = req.body.state_code;
    var phone_number = req.body.phone_number;
    var zip_code = req.body.zip_code;
    var street_address = req.body.street_address;
    var extended_street_address = req.body.extended_street_address;
    var email =
      first_name.trim() + "." + last_name.trim() + "@student.giu-uni.de";
    await sequelize
      .query(
        `INSERT INTO students(first_name, last_name, country, country_code, local, state_code, phone_number, zip_code, street_address, extended_street_address, email) VALUES('${first_name}', '${last_name}', '${country}', '${country_code}', '${local}', '${state_code}', '${phone_number}', '${zip_code}', '${street_address}', '${extended_street_address}', '${email}')`
      )
      .catch((e) => console.log(e));

    var showUser = await sequelize.query(
      `SELECT * FROM students WHERE email = '${email}'`,
      { plain: true, type: QueryTypes.SELECT }
    );

    return res.json({ res: "Successfully created!", message: showUser });
  } catch (e) {
    return res.json({
      res: "Please enter your data correctly!",
      message: null,
    });
  }
});
