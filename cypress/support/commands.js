Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (data = {
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    text: 'Atendimento bãom demais!'
}) => {
    cy.get('#firstName').type(data.firstName)
    cy.get('#lastName').type(data.lastName)
    cy.get('#email').type(data.email)
    cy.get('#open-text-area').type(data.text)
    cy.contains('button', 'Enviar').click()
})