import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from './components/Button'
import type { HelloResponse } from '../shared/types'
import viteLogo from '/vite.svg'
import reactLogo from './assets/react.svg'

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`

const Logo = styled.img`
  height: 6rem;
  padding: 1.5rem;
  will-change: filter;
  transition: filter 300ms;

  &:hover {
    filter: drop-shadow(0 0 2rem #646cffaa);
  }

  &.react:hover {
    filter: drop-shadow(0 0 2rem #61dafbaa);
  }
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const Card = styled.div`
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  margin: 1rem 0;
`

const ApiResponse = styled.pre`
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 4px;
  text-align: left;
  overflow-x: auto;
  font-size: 0.875rem;
`

function App() {
  const [count, setCount] = useState(0)
  const [apiData, setApiData] = useState<HelloResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchHello = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('API fetch failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <Container>
      <LogoContainer>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <Logo src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <Logo src={reactLogo} className="react" alt="React logo" />
        </a>
      </LogoContainer>

      <Title>Bun + Vite + React</Title>

      <Card>
        <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
        <p style={{ marginTop: '1rem', color: '#888' }}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </Card>

      <Card>
        <h2 style={{ marginBottom: '1rem' }}>API Response</h2>
        <Button onClick={fetchHello} disabled={loading} $variant="secondary">
          {loading ? 'Loading...' : 'Refresh API'}
        </Button>
        {apiData && (
          <ApiResponse>{JSON.stringify(apiData, null, 2)}</ApiResponse>
        )}
      </Card>
    </Container>
  )
}

export default App
