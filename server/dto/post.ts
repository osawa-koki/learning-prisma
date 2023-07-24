export const PostSlim = {
  id: true,
  title: true
}

export const PostFat = {
  id: true,
  title: true,
  content: true,
  author: {
    select: {
      id: true,
      uuid: true,
      profile: {
        select: {
          name: true,
          age: true,
          birthday: true
        }
      }
    }
  }
}
