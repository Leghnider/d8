var mongoose = require("mongoose");
var UserAccount = require("../../models/userAccount");

require("../mongodb_helper");

describe("Home Model", function () {
  // beforeEach(function (done) {
  //   mongoose.connection.collections.userAccount.drop(function () {
  //     done();
  //   });
  // });

  it("has the correct input", function () {
    var user = new UserAccount({
      firstName: "Jane",
      lastName: "Doe",
      age: 19,
      email: "jane@test.com",
      password: "jane123",
    });

    user.save(() => {
      expect(user.firstName).toEqual("Jane");
      expect(user.lastName).toEqual("Doe");
      expect(user.age).toEqual(19);
      expect(user.email).toEqual("jane@test.com");
    });
  });
});
