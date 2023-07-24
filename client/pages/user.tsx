import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Alert, Table } from 'react-bootstrap'
import { BsTrashFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import setting from '../setting'
import Layout from '../components/Layout'

interface IUser {
  id: number
  uuid: string
  profile: {
    name: string
    age: number
    birthday: Date
  }
  posts: [
    {
      id: number
      title: string
      content: string
    }
  ]
}

const Component = (): JSX.Element => {
  const router = useRouter()
  const { user_id: userId }: {
    user_id?: string
  } = router.query

  const { data: user, error } = useSWR<IUser>(userId != null ? `${setting.apiPath}/api/users/${userId}` : null, async (url: string) => {
    const response = await fetch(url)
    if (response.status === 404) {
      toast('User not found.')
      router.push('/users/')
    }
    return response.json()
  })

  const deleteUser = (): void => {
    if (confirm('Are you sure?')) {
      fetch(`${setting.apiPath}/api/users/${userId}`, {
        method: 'DELETE'
      })
      .then(() => {
        router.push('/users/')
        toast('User deleted.')
      })
      .catch((err) => {
        toast(err.message, { type: 'error' })
      })
    }
  }

  if (error != null) {
    return <Alert variant="danger">{error}</Alert>
  }
  if (user == null) {
    return <Alert variant="info">Loading...</Alert>
  }

  return <>
    <div className='d-flex flex-row-reverse'>
      <BsTrashFill role='button' className='text-danger' onClick={deleteUser} />
    </div>
    <h2>Profile</h2>
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{user?.id}</td>
        </tr>
        <tr>
          <th>UUID</th>
          <td>{user?.uuid}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{user?.profile?.name}</td>
        </tr>
        <tr>
          <th>Age</th>
          <td>{user?.profile?.age}</td>
        </tr>
        <tr>
          <th>Birthday</th>
          <td>{user?.profile?.birthday?.toString()}</td>
        </tr>
      </tbody>
    </Table>
    <hr />
    <h2>Posts</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Content</th>
        </tr>
      </thead>
      <tbody>
        {user?.posts?.map((post) => (
          <tr key={post.id}>
            <td>
              <Link href={`/post/?post_id=${post.id}`}>#{post.id}</Link>
            </td>
            <td>{post.title}</td>
            <td>{post.content}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
}

export default function UserPage (): JSX.Element {
  return (
    <Layout>
      <h1>User</h1>
      <Component />
    </Layout>
  )
}
