describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'John Smith',
      username: 'jsmith',
      password: 'mithsohn'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const secondUser = {
      name: 'Bob Jones',
      username: 'bjones',
      password: 'jonoob'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, secondUser)
    cy.visit('')
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
      cy.login({ username: 'jsmith', password: 'mithsohn' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('First class tests')
      cy.get('#author').type('Robert C. Martin')
      cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
      cy.get('#create-blog-button').click()
      cy.contains('First class tests Robert C. Martin')
    })

    describe('And several blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          likes: 0
        })
        cy.createBlog({
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 5
        })
        cy.createBlog({
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 2
        })
      })

      it('A blog can be liked', function() {
        cy.contains('First class tests Robert C. Martin').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('.like-button').click()
        cy.get('@theBlog').should('contain', 'likes 1')
      })

      it('The user who created the blog can delete it', function() {
        cy.on('window:confirm', (str) => {
          expect(str).to.eq('Remove blog First class tests by Robert C. Martin')
          return true
        })
        cy.contains('First class tests Robert C. Martin').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('.delete-button').click()
        cy.get('html').should('not.contain', 'First class tests')
      })

      it('Another user can not see the delete button', function() {
        cy.login({ username: 'bjones', password: 'jonoob' })
        cy.contains('First class tests Robert C. Martin').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').should('not.contain', 'remove')
      })

      it('Blogs are ordered by likes', function() {
        cy.contains('First class tests Robert C. Martin').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').find('.like-button').as('blogLike')
        cy.get('@blogLike').click()
        cy.get('@blogLike').click()
        cy.get('@blogLike').click()
        cy.get('.blog').eq(0).should('contain', 'Canonical string reduction')
        cy.get('.blog').eq(1).should('contain', 'First class tests')
        cy.get('.blog').eq(2).should('contain', 'Go To Statement Considered Harmful')
      })
    })
  })
})