describe("Register", function () {
  it("has a register form", function () {
    cy.visit("/register");
    cy.get("#register-form").find("#firstName").type("Sam");
    cy.get("#register-form").find("#lastName").type("Smith");
    cy.get("#register-form").find("#age").type(25);
    cy.get("#register-form").find("#email").type("sam@test.co.uk");
    cy.get("#register-form").find("#password").type("testpassword123");
    cy.get("#register-form").submit();

    cy.url().should("eq", "http://localhost:3030/login");
  });
});
