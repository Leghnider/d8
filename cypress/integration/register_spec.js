describe('Register', function(){
  before(async (done) => {
    await cy.task("db:drop");
    done();
  });
  
  it('has a register form', function() {
    cy.signup('Sam', 'Smith', 25, 'sam@test.co.uk', 'sam123')
    cy.url().should('eq', 'http://localhost:3030/register-profile');

    cy.createProfile('Sammy', 'I like fast cars', 'North London', 25, 'Male', 'Men' )
    cy.url().should('eq', 'http://localhost:3030/home');
  });
});
