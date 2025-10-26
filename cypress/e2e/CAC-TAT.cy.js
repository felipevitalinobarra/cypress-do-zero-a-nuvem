describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => { cy.visit('./src/index.html') })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()

    const longText = Cypress._.repeat('Melhorar o tempo de SLA do atendimento!\n', 10)

    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe.barra@cypress.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('be.visible')

    cy.tick(3000)

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe#cypress.com')
    cy.get('#open-text-area').type('Atendimento excelente!')
    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')

    cy.tick(3000)

    cy.contains('.error', 'Valide os campos obrigatórios!').should('not.be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
    cy.get('#phone')
      .type('!@#$%¨&*()ABCdef')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Barra')
    cy.get('#email').type('felipe.barra@cypress.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Péssimo atendimento!')
    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')

    cy.tick(3000)

    cy.contains('.error', 'Valide os campos obrigatórios!').should('not.be.visible')
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
    cy.clock()

    cy.contains('button', 'Enviar').click()

    cy.contains('.error', 'Valide os campos obrigatórios!').should('be.visible')

    cy.tick(3000)

    cy.contains('.error', 'Valide os campos obrigatórios!').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()

    cy.fillMandatoryFieldsAndSubmit()

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('be.visible')

    cy.tick(3000)

    cy.contains('.success', 'Mensagem enviada com sucesso.').should('not.be.visible')
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
    cy.get(':radio')
      .check('feedback')
      .should('be.checked')
      .and('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get(':radio').each(($radio) => {
      cy.wrap($radio)
        .check()
        .should('be.checked')
        .and('have.value', $radio.val())
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get(':checkbox')
      .check()
      .should('be.checked')
      .and('have.length', 2)
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('exampleFile')

    cy.get('#file-upload')
      .selectFile('@exampleFile')
      .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.url().should('include', 'privacy.html')
    cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando .invoke', () => {
    cy.get('#open-text-area')
      .invoke('val', 'Um texto qualquer')
      .should('have.value', 'Um texto qualquer')
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')
  })

  it('encontra o gato escondido', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
      .should('have.text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'I hate cats!')
      .should('have.text', 'I hate cats!')
  })
})