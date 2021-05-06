describe("session", function () {
  describe("loggging in to a session", function () {
    beforeEach(() => {
      cy.visit("/signup");
      cy.get("#sign-up-form").find("#firstName").type("Jane");
      cy.get("#sign-up-form").find("#lastName").type("Doe");
      cy.get("#sign-up-form").find("#email").type("email@test.co.uk");
      cy.get("#sign-up-form").find("#password").type("test123");
      cy.get("#sign-up-form").submit();
    });

    it("allows them to log in and see profiles", function () {
      cy.contains("Log In").click();

      cy.url().should("eq", "http://localhost:3030/users/login");

      cy.get("#log-in-form").find("#email").type("email@test.co.uk");
      cy.get("#log-in-form").find("#password").type("test123");
      cy.get("#log-in-form").submit();
    });
  });
});
