const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("User sleep data API", () => {
  describe("POST /smartwatchdata/", () => {
    it("It should protect the endpoint", (done) => {
      chai
        .request(server)
        .post("/smartwatchdata/")
        .set("content-type", "application/json")
        .send({
          "2021-06-13 23:24:06.886": "[-0.103112, 9.77631, 0.81235]",
          "2021-06-13 23:24:06.892": "[0.100707, 9.77631, 0.81235]",
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
