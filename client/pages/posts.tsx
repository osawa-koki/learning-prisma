import React from 'react'
import Layout from '../components/Layout'
import router from 'next/router'
import useSWR from 'swr'
import { Alert, Badge, Table } from 'react-bootstrap'
import setting from '../setting'
import Link from 'next/link'
import fetcher from '../src/fetcher'

interface IPost {
  id: number
  title: string
}

const Component = (): JSX.Element => {
  const {
    data: users,
    error
  } = useSWR<IPost[]>(`${setting.apiPath}/api/posts`, fetcher)

  if (error != null) {
    return <Alert variant="danger">{error}</Alert>
  }
  if (users == null) {
    return <Alert variant="info">Loading...</Alert>
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {users.map((post) => (
          <tr key={post.id}>
            <td>
              <Link href={`/post/?post_id=${post.id}`}>#{post.id}</Link>
            </td>
            <td>{post.title}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default function PostsPage (): JSX.Element {
  return (
    <Layout>
      <h1 className='d-flex justify-content-between'>
        Posts
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Badge role='button' onClick={async () => {
          await router.push('/posts/new')
        }}>New</Badge>
      </h1>
      <Component />
    </Layout>
  )
}
