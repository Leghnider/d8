describe("session", function () {
  before(async (done) => {
    await cy.task("db:drop");
    done();
  });

  describe("loggging in to a session", function () {
    beforeEach(() => {
      cy.signup('Sam', 'Smith', 25, 'sam@test.co.uk', 'sam123');
      cy.createProfile('Sammy', 'I like fast cars', 'North London', 25, 'Male', 'Men');
    });

    it("allows them to log in and see profiles", function () {
      cy.contains("Log Out").click();
      cy.visit("/login");

      cy.url().should("eq", "http://localhost:3030/login");

      cy.login('sam@test.co.uk','sam123');

      cy.url().should("eq", "http://localhost:3030/home");
      cy.contains("Log Out").click();
    });

    it("redirects them if login credentials are incorrect", function () {
      cy.contains("Log Out").click();
      cy.visit("/login");
      cy.login('sam@test.co.uk','sam12345');

      cy.url().should("eq", "http://localhost:3030/login");
    });

    it("allows them to logout", function () {
      cy.url().should("eq", "http://localhost:3030/home");
      cy.contains("Log Out").click();

      cy.url().should("eq", "http://localhost:3030/login");
    });
  });
});
