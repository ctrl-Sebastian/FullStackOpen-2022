import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Tests of Blog component', () => {
    const blog = {
        title: 'blog.test.js prueba',
        author: 'el mismo de siempre',
        url: 'exampleURL.com',
        likes: 1,
        user: {
            username: 'Caliban',
            name: 'Sebastian',
            id: '63f82ba5dce6ae95045edba7'
        }
    }
    const user = {
        username: 'Caliban',
        name: 'Sebastian',
        id: '63f82ba5dce6ae95045edba7'
    }

    test('renders title and author', () => {
        const { container } = render(
            <Blog blog={blog}  user = {user}/>
        )

        const div = container.querySelector('.blog')
        expect(div).toHaveTextContent(
            'blog.test.js prueba el mismo de siempre'
        )
    })

    test('clicking the view button shows the url and likes', () => {
        const { container } = render(
            <Blog blog={blog}  user = {user} />
        )

        const button = screen.getByText('view')
        fireEvent.click(button)

        expect(container).toHaveTextContent(
            'Url'
        )

        expect(container).toHaveTextContent(
            'Likes'
        )
    })

    test('if the like button is clicked twice the event handler is called twice', () => {
        const mockHandler = jest.fn()
        render(
            <Blog blog={blog}  user = {user} />
        )

        const button = screen.getByText('view')
        fireEvent.click(button)

        const likeButton = screen.getByText('Like')
        fireEvent.click(likeButton)
        mockHandler.mock.calls += 1
        fireEvent.click(likeButton)
        mockHandler.mock.calls += 1

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})

