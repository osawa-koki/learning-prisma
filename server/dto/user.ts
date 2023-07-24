export const UserSlim = {
  id: true,
  uuid: true,
  profile: {
    select: {
      name: true
    }
  }
}

export const UserFat = {
  id: true,
  uuid: true,
  profile: {
    select: {
      name: true,
      age: true,
      birthday: true
    }
  },
  posts: {
    select: {
      id: true,
      title: true,
      content: true
    }
  }
}
