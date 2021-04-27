process.env.NODE_ENV = "test";
const fs = require("fs");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("/api/upload", () => {
  it("it should upload the image", (done) => {
    chai
      .request(server)
      .post("/api/upload")
      .set("Content-Type", "multipart/form-data")
      .attach("image", fs.readFileSync(`${__dirname}/kobe.jpg`), "kobe.jpg")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("key");
        done();
      });
  });
});
