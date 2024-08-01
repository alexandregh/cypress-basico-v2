/// <reference types="Cypress" />

const { get } = require("http");

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
       cy.visit('./src/index.html') // O ./ INDICA A RAIZ DO PROJETO COMO PONTO DE PARTIDA 
    })
    it('CT01 - Verifica o Titulo da Aplicação', () => {        
        cy.title()
        .should('be.equals', 'Central de Atendimento ao Cliente TAT')
    });
    it('CT02 - Preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, '
        
        cy.get('#firstName').type('Walmyr')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('walmyr@exemplo.com')
        cy.get('#open-text-area').type(longText, {delay:0})
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
        .contains('strong', 'Mensagem enviada com sucesso.')
        .should('be.visible')
    });
    it('CT03 - Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Walmyr')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('walmyrexemplo.com')
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
        .contains('strong', 'Valide os campos obrigatórios!')
        .should('be.visible')
    });
    it('CT04 - Campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone')
        .type('abcdefghij')
        .should('have.value', '')
    });
    it('CT05 - Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Walmyr')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('walmyr@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        .contains('strong', 'Valide os campos obrigatórios!')
        .should('be.visible')
    });
    it('CT06 - Preenche e limpa os campos "nome", "sobrenome", "email" e "telefone", "Como podemos te ajudar?"', () => {
        cy.get('#firstName').type('Walmyr')
        .should('have.value', 'Walmyr')
        .clear().should('have.value', '')

        cy.get('#lastName').type('Filho')
        .should('have.value', 'Filho')
        .clear().should('have.value', '')

        cy.get('#email').type('walmyr@exemplo.com')
        .should('have.value', 'walmyr@exemplo.com')
        .clear().should('have.value', '')

        cy.get('#phone').type('987654321')
        .should('have.value', '987654321')
        .clear().should('have.value', '')

        cy.get('#open-text-area').type('Teste')
        .should('have.value', 'Teste')
        .clear().should('have.value', '')
    });
    it('CT07 - Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('button[type="submit"]').click()      
        cy.get('.error').should('be.visible')
        .contains('strong', 'Valide os campos obrigatórios!')
        .should('be.visible')
    });
    it('CT08 - Envia o formulário com sucesso usando o comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        .contains('strong', 'Mensagem enviada com sucesso.')
        .should('be.visible')
    });
    it('CT09 - Seleciona um  produto (youtube) por seu texto', () => {
        cy.get('#product').select('YouTube')
        .should('contain.text', 'YouTube')
    });
    it('CT10 - Seleciona um produto (Mentoria) por seu valor (value)', () => {
        let valor = 'mentoria'
        cy.get('#product').select('mentoria')
        .should('have.value', valor)
    });
    it('CT11 - Seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1)
        .should('have.value', 'blog')
    });
    it('CT12 - Marca cada tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]').check()
        .should('have.value', 'feedback')
    });
    it('CT13 - Marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]').should('have.length', 3)
        // each recebe uma função de callback com argumento que é o elemento DOM e percorre cada valor desse elemento
        .each(($radio) => {
            cy.wrap($radio).check() // o wrap empacota (seleciona) cada valor do elemento DOM
            cy.wrap($radio).should('be.checked')
        })
    });
    it('CT14 - Marca ambos checkbox depois desmarca o último', () => {
        cy.get('input[type="checkbox"]').check()
        .should('be.checked').last() // último
        .uncheck().should('not.be.checked')
    });
    it('CT15 - Seleciona um aquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(($input) => {
            console.log($input)
            // verifica o nome do arquivo para upload com "$input[0].files[0].name do console"
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });
    it('CT16 - Seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
        .should(($input) => {
            console.log($input)
            // verifica o nome do arquivo para upload com "$input[0].files[0].name do console"
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });
    it('CT17 - Seleciona um arquivo utilizando uma fixtrepara a qual foi dada um alias', () => {
        cy.fixture('example.json') // pega o arquivo direto ao invés do caminho do seu arquivo
        .as('sampleFile') // um álias para example chamado "sampreFile"
        .get('input[type="file"]')
        .selectFile('@sampleFile') // chama o álias com o @ (arroba)
        .should(($input) => {
            // verifica o nome do arquivo para upload com "$input[0].files[0].name do console"
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });
    it('CT18 - Verfica que a "Politica de Privacidade" abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    });
    it('CT19 - Testa a página da "Plítica de Privacidade" removendo o target e clica no link', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target', '_blank') // invoca uma ação neste exemplo "removeAttr"
        .click()
        cy.get('#white-background')
        .contains('Talking About Testing')
        .should('be.visible')
    });
    it.only('CT19 - Testa a página da "Plítica de Privacidade" de forma independente', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target', '_blank') // invoca uma ação neste exemplo "removeAttr"
        .click()
        cy.get('#title')
        .contains('h1', 'CAC TAT - Política de privacidade').should('be.visible')
        cy.get('#white-background')
        .should('not.have.text')
        .contains('p', 'Talking About Testing')
        .should('be.visible', 'p', 'Talking About Testing')
    });
})