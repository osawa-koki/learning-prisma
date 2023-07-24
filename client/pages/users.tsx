import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import { Alert, Table } from 'react-bootstrap'
import setting from '../setting'
import Link from 'next/link'
import fetcher from '../src/fetcher'

interface IUser {
  id: number
  uuid: string
  profile: {
    name: string
  }
}

const Component = (): JSX.Element => {
  const {
    data: users,
    error
  } = useSWR<IUser[]>(`${setting.apiPath}/api/users`, fetcher)

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
  )
}

export default function UsersPage (): JSX.Element {
  return (
    <Layout>
      <h1>Users</h1>
      <Component />
    </Layout>
  )
}
