import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Table } from 'react-bootstrap'
import setting from '../setting'
import Link from 'next/link'

type IUser = {
  id: number,
  uuid: string,
  profile: {
    name: string
  }
}

export default function UsersPage(): JSX.Element {

  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    fetch(`${setting.apiPath}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <Layout>
      <h1>Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link href={`/users/${user.id}`}>#{user.id}</Link>
              </td>
              <td>{user.profile.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
