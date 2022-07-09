import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'

export const NotAPlayerCard = () => {
  const [playerRequested, setPlayerRequested] = useState(false)
  return <Card bg='dark' text='light' className='my-3' style={{ width: '18rem', margin: 'auto' }}>
    <Card.Body>
      <Card.Title className='fs-1'>Ты не игрок</Card.Title>
      <Card.Text>Для доступа к этой странице нужно быть игроком</Card.Text>
      <Button
        onClick={() => setPlayerRequested(true)}
        className='mx-auto w-100'
        variant='primary'
        disabled={playerRequested}
      >{playerRequested ? 'Запрос отправлен' : 'Хочу быть игроком'}</Button>
    </Card.Body>
  </Card>
}