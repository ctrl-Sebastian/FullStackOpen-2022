describe('Blog app', () => {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Luffy',
            username: 'Mugiwara',
            password: 'JoyBoy'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('')
    })

    it('front page can be opened', function() {
        cy.contains('Blogs')
    })

    it('login fails with wrong password', function() {
        cy.contains('log in').click()
        cy.get('#username').type('Mugiwara')
        cy.get('#password').type('blablabla')
        cy.get('#login-button').click()

        cy.get('.error').contains('Wrong credentials')
        cy.get('html').should('not.contain', 'Luffy logged in')
    })

    it('user can log in', function() {
        cy.contains('log in').click()
        cy.get('#username').type('Mugiwara')
        cy.get('#password').type('JoyBoy')
        cy.get('#login-button').click()

        cy.contains('Luffy logged in')
    })

    it('they are ordered by number of likes', function() {
        cy.login({ username: 'Mugiwara', password: 'JoyBoy' })
        const blog1 = {
            title : 'test blog 1',
            author: 'luffy',
            url: 'www.exampleURL.com',
            likes: 1
        }
        cy.createBlog(blog1)
        const blog2 = {
            title : 'test blog 2',
            author: 'zoro',
            url: 'www.exampleURL.com',
            likes: 2
        }
        cy.createBlog(blog2)
        const blog3 = {
            title : 'test blog 3',
            author: 'sanji',
            url: 'www.exampleURL.com',
            likes: 3
        }
        cy.createBlog(blog3)

        cy.contains('view').click()
        cy.contains('Likes').parent().as('likeblock')
        cy.get('@likeblock').contains(3)
    })


    describe('When logged in', () => {
        beforeEach(function() {
            cy.login({ username: 'Mugiwara', password: 'JoyBoy' })
        })

        it('a new blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Luffy Marrera')
            cy.get('#url').type('exampleURL.com')
            cy.contains('save').click()

            cy.contains('a blog created by cypress Luffy Marrera')
        })

        it('user can like a blog', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Luffy Marrera')
            cy.get('#url').type('exampleURL.com')
            cy.contains('save').click()

            cy.contains('view').click()
            cy.contains('0')
            cy.get('#like-button').click()
            cy.contains('view').click()
            cy.contains('1')

        })

        it('user can delete a blog of its own', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Luffy Marrera')
            cy.get('#url').type('exampleURL.com')
            cy.contains('save').click()
            cy.wait(5000)
            cy.reload()

            cy.contains('view').click()
            cy.contains('Remove').click()
            cy.get('html').should('not.contain', 'a blog created by cypress Luffy Marrera')

        })

    })
})