"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
chai.should();

chai.use(chaiHttp);

describe("Application API", () => {
  describe("GET /user/", () => {
    it("It should protect the endpoint", (done) => {
      chai
        .request(server)
        .get("/user/wsad")
        .set("content-type", "application/json")
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
