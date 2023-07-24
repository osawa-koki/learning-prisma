import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Alert, Table } from 'react-bootstrap'
import setting from '../setting'
import Layout from '../components/Layout'
import fetcher from '../src/fetcher'

interface IPost {
  id: number
  title: string
  content: string
  author: {
    id: number
    profile: {
      name: string
      age: number
      birthday: Date
    }
  }
}

const Component = (): JSX.Element => {
  const router = useRouter()
  const { post_id: postId }: {
    post_id?: string
  } = router.query

  const { data: post, error } = useSWR<IPost>(postId != null ? `${setting.apiPath}/api/posts/${postId}` : null, fetcher)

  if (error != null) {
    return <Alert variant="danger">{error}</Alert>
  }
  if (post == null) {
    return <Alert variant="info">Loading...</Alert>
  }

  return <>
    <h2>Profile</h2>
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{post?.id}</td>
        </tr>
        <tr>
          <th>Title</th>
          <td>{post?.title}</td>
        </tr>
        <tr>
          <th>Content</th>
          <td>{post?.content}</td>
        </tr>
      </tbody>
    </Table>
    <hr />
    <h2>Author</h2>
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>ID</th>
          <td>
            <Link href={`/user/?user_id=${post.author.id}`}>#{post.author.id}</Link>
          </td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{post.author.profile.name}</td>
        </tr>
        <tr>
          <th>Age</th>
          <td>{post.author.profile.age}</td>
        </tr>
        <tr>
          <th>Birthday</th>
          <td>{post.author.profile.birthday.toString()}</td>
        </tr>
      </tbody>
    </Table>
  </>
}

export default function PostPage (): JSX.Element {
  return (
    <Layout>
      <h1>Post</h1>
      <Component />
    </Layout>
  )
}
