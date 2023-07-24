import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import setting from '../../setting'
import router from 'next/router'

export default function UserForm (): JSX.Element {
  const [name, setName] = useState('user xxx')
  const [age, setAge] = useState(20)
  const [birthday, setBirthday] = useState(dayjs().subtract(20, 'year').toDate())
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  const create = async () => {
    setLoading(true)
    const response = await fetch(`${setting.apiPath}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, birthday, password })
    })
    const data = await response.json()
    toast(`User created: #${data.id}`)
    await router.push('/users/')
  }

  return <Layout>
    <h1>New User</h1>
    <Form>
      <Form.Group className='mt-3'>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={name} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)
        } />
      </Form.Group>
      <Form.Group className='mt-3'>
        <Form.Label>Age</Form.Label>
        <Form.Control type="number" value={age} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => setAge(parseInt(event.target.value))
        } />
      </Form.Group>
      <Form.Group className='mt-3'>
        <Form.Label>Birthday</Form.Label>
        <Form.Control type="date" value={dayjs(birthday).format('YYYY-MM-DD')} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => setBirthday(new Date(event.target.value))
        } />
      </Form.Group>
      <Form.Group className='mt-3'>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)
        } />
      </Form.Group>
      <Button className='d-block mt-3 m-auto' variant='primary' type='button' onClick={create} disabled={loading}>Create</Button>
    </Form>
  </Layout>
}
