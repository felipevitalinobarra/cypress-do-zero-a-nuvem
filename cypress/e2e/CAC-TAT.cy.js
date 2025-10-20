describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => { cy.visit('./src/index.html') })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = Cypress._.repeat('Melhorar o tempo de SLA do atendimento!\n', 20)

    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe.barra@cypress.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe#cypress.com')
    cy.get('#open-text-area').type('Atendimento excelente!')
    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
    cy.get('#phone')
      .type('!@#$%¨&*()ABCdef')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe.barra@cypress.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Péssimo atendimento!')
    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Felipe')
      .should('have.value', 'Felipe')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Barra')
      .should('have.value', 'Barra')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('felipe.barra@cypress.com')
      .should('have.value', 'felipe.barra@cypress.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('123456789')
      .should('have.value', '123456789')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]')
      .check('feedback')
      .should('be.checked')
      .and('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]').each(($radio) => {
      cy.wrap($radio)
        .check()
        .should('be.checked')
        .and('have.value', $radio.val())
    })
  })
})