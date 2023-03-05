import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
    const blog = {
        title: 'blog.test.js prueba',
        author: 'el mismo de siempre',
        url: 'exampleURL.com',
        likes: 0
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('blog.test.js prueba')
    expect(element).toBeDefined()
})