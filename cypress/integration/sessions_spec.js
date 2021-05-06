describe("session", function () {
  describe("loggging in to a session", function () {
    beforeEach(() => {});

    it("allows them to log in and see profiles", function () {
      cy.visit("/register");
      cy.get("#register-form").find("#firstName").type("Jane");
      cy.get("#register-form").find("#lastName").type("Doe");
      cy.get("#register-form").find("#email").type("email@test.co.uk");
      cy.get("#register-form").find("#age").type(23);
      cy.get("#register-form").find("#password").type("test123");
      cy.get("#register-form").submit();

      cy.visit("/login");

      cy.url().should("eq", "http://localhost:3030/login");

      cy.get("#log-in-form").find("#email").type("email@test.co.uk");
      cy.get("#log-in-form").find("#password").type("test123");
      cy.get("#log-in-form").submit();

      cy.url().should("eq", "http://localhost:3030/home");
    });

    it("redirects them if login credentials are incorrect", function () {
      cy.visit("/login");
      cy.get("#log-in-form").find("#email").type("email@test.co.uk");
      cy.get("#log-in-form").find("#password").type("incorrect");
      cy.get("#log-in-form").submit();

      cy.url().should("eq", "http://localhost:3030/login");
    });

    it("allows them to logout", function () {
      cy.visit("/login");
      cy.get("#log-in-form").find("#email").type("email@test.co.uk");
      cy.get("#log-in-form").find("#password").type("test123");
      cy.get("#log-in-form").submit();
      cy.url().should("eq", "http://localhost:3030/home");
      cy.contains("Log Out").click();

      cy.url().should("eq", "http://localhost:3030/login");

      // cy.visit("/dashboard");
      // cy.get("h1").not("contain", "D8 Profiles");
    });
  });
});
