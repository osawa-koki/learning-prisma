import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import setting from '../../setting'
import { Alert, Table } from 'react-bootstrap'

interface IUser {
  id: number
  uuid: string
  profile: {
    name: string
    age: number
    birthday: Date
  }
}

const Component = (): JSX.Element => {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  const { data: user, error } = useSWR<IUser>(userId != null ? `${setting.apiPath}/api/users/${userId}` : null)

  useEffect(() => {
    console.log(router.query.user_id)
    setUserId(router.query.user_id as string)
  }, [router.query.user_id])

  if (error != null) {
    return <Alert variant="danger">{error}</Alert>
  }
  if (user == null) {
    return <Alert variant="info">Loading...</Alert>
  }

  return <>
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
          <td>{user?.profile.name}</td>
        </tr>
        <tr>
          <th>Age</th>
          <td>{user?.profile.age}</td>
        </tr>
        <tr>
          <th>Birthday</th>
          <td>{user?.profile.birthday.toString()}</td>
        </tr>
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
