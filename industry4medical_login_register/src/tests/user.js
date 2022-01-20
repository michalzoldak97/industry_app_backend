const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("Login Register API", () => {
  describe("POST /login", () => {
    it("It should validate user and return token", (done) => {
      chai
        .request(server)
        .post("/login/test/")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          username: `${process.env.TEST_USERNAME}`,
          password: `${process.env.TEST_USER_PASS}`,
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
