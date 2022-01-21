"use strict";
const chai = require("chai");
const server = require("../server");
chai.should();

describe("Sleep Data consumer", async () => {
  describe("Invalid message scenatio", async () => {
    let errorMsg = `None`;
    try {
      const res = await server.sendDataToDb(undefined);
    } catch (e) {
      errorMsg = e.toString();
    }
    it("It should throw syntax error", (done) => {
      errorMsg.should.be.eq(
        `SyntaxError: Unexpected token u in JSON at position 0`
      );
      done();
    });
  });
});
