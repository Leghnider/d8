var mongoose = require('mongoose');

require('../mongodb_helper')
var User = require('../../models/userAccount');

describe('userAccount model', function() {
  beforeEach(function(done) {
    mongoose.connection.collections.useraccounts.drop(function() {
      done();
    });
  });

  it('register function', function(){
    var user = new User({ firstName: 'Sam', lastName:'Smith', age: 25, email: 'sam@test.co.uk' , password: 'testpassword123'});
    expect(user.firstName).toEqual('Sam');
    expect(user.lastName).toEqual('Smith');
    expect(user.age).toEqual(25);
    expect(user.email).toEqual('sam@test.co.uk');
  });


})