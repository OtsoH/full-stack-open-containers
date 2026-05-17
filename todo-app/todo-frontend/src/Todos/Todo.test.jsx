import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Todo from './Todo'

const noop = () => {}

describe('Todo', () => {
  it('renders the todo text', () => {
    render(<Todo todo={{ text: 'Write tests', done: false }} deleteTodo={noop} completeTodo={noop} />)
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })
})