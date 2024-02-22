async function getFollowing(followingFeed) {

  const following = []
  let isMoreAvailable = true

  do {
    const followingArr = (await followingFeed.request()).users
    following.push(...followingArr)
    isMoreAvailable = followingFeed.isMoreAvailable()
  }
  while (isMoreAvailable)

  return following

}

async function getFollower(followerFeed) {

  const followers = []
  let isMoreAvailable = true

  do {
    const followingArr = (await followerFeed.request()).users
    followers.push(...followingArr)
    isMoreAvailable = followerFeed.isMoreAvailable()
  }
  while (isMoreAvailable)

  return followers

}

async function getPosts(userFeed) {

  const posts = []
  let nextMaxId = null
  let response

  do {
    response = await userFeed.request()
    postArr = response.items
    posts.push(...postArr)
    nextMaxId = response.next_max_id
  } while (nextMaxId)

  return posts

}

module.exports = {
  getFollowing,
  getFollower,
  getPosts
}