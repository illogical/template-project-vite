import styled, { css } from 'styled-components'

interface ButtonProps {
  $variant?: 'primary' | 'secondary'
}

export const Button = styled.button<ButtonProps>`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.25s;

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background-color: #1a1a1a;
          color: #fff;

          &:hover {
            border-color: #646cff;
          }

          &:focus,
          &:focus-visible {
            outline: 4px auto -webkit-focus-ring-color;
          }
        `
      : css`
          background-color: #333;
          color: #888;

          &:hover {
            border-color: #888;
            color: #fff;
          }
        `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
