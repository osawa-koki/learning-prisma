import React, { useState } from 'react'
import router from 'next/router'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import Layout from '../../components/Layout'
import setting from '../../setting'

interface IAuthor {
  id: number
  profile: {
    name: string
  }
}

export default function PostForm (): JSX.Element {
  const [authorId, setAuthorId] = useState<number | null>(null)
  const [title, setTitle] = useState('post xxx')
  const [content, setContent] = useState('content')
  const [loading, setLoading] = useState(false)

  const {
    data: authors,
    error
  } = useSWR<IAuthor[]>(`${setting.apiPath}/api/users`, async (url: string) => {
    const response = await fetch(url)
    return (await response.json()) as IAuthor[]
  })

  const create = async (): Promise<void> => {
    setLoading(true)
    const response = await fetch(`${setting.apiPath}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author_id: authorId })
    })
    const data = (await response.json()) as { id: number }
    toast(`Post created: #${data.id}`)
    await router.push('/posts/')
  }

  return <Layout>
    <h1>New Post</h1>
    <Form>
      <Form.Group className='mt-3'>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" value={title} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => { setTitle(event.target.value) }
        } />
      </Form.Group>
      <Form.Group className='mt-3'>
        <Form.Label>Content</Form.Label>
        <Form.Control as="textarea" value={content} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => { setContent(event.target.value) }
        } />
      </Form.Group>
      <Form.Group className='mt-3'>
        <Form.Label>Author</Form.Label>
        <Form.Control as="select" value={authorId ?? ''} onInput={
          (event: React.ChangeEvent<HTMLInputElement>) => { setAuthorId(parseInt(event.target.value)) }
        }>
          <option value={''}>Select author</option>
          {
            authors?.map((author) => (
              <option key={author.id} value={author.id}>{author.profile.name}</option>
            ))
          }
        </Form.Control>
      </Form.Group>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button className='d-block mt-3 m-auto' variant='primary' type='button' onClick={create} disabled={loading || authorId == null}>Create</Button>
    </Form>
  </Layout>
}
