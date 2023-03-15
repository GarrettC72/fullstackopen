describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'John Smith',
      username: 'jsmith',
      password: 'mithsohn'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('jsmith')
      cy.get('#password').type('mithsohn')
      cy.get('#login-button').click()

      cy.contains('John Smith logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('jsmith')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'John Smith logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('jsmith')
      cy.get('#password').type('mithsohn')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('First class tests')
      cy.get('#author').type('Robert C. Martin')
      cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
      cy.get('#create-blog-button').click()
      cy.contains('First class tests Robert C. Martin')
    })
  })
})