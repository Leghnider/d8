var mongoose = require('mongoose');
var User = require('../../models/userAccount');
var Profile = require('../../models/userProfile');

require('../mongodb_helper');
describe('userProfile model', function() {
    // beforeEach(function(done) {
    //     mongoose.connection.collections.userprofiles.drop(function() {
    //         done();
    //     });
    // });

    it('creates a profile', function() {
        var user = new Profile({ username: 'zay', bio: 'i love football', age: 22, location: 'London', gender: 'female', interested_in: 'men'});
        expect(user.username).toEqual('zay');
        expect(user.bio).toEqual('i love football');
        expect(user.age).toEqual(22);
        expect(user.location).toEqual('London');
        expect(user.gender).toEqual('female');
        expect(user.interested_in).toContain('men');
    });

    it('records the user id', function() {
        var user = new User({ firstName: 'zineb', lastName: 'leg', age: 22, emai: 'zineb@test.co.uk', password:'zineb123'});
        var profile = new Profile({ username: 'zay', bio: 'i love football', age: 22, location: 'London', gender: 'female', interested_in: 'men', useraccount: user._id});
        expect(user.id).toContain(profile.useraccount);
    })
});

