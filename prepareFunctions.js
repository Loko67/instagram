function preparePost(rawPosts) {

  const posts = []

  for (const rawPost of rawPosts) {

    const post = {
      id: rawPost.pk,
      authorId: rawPost.user.id,
      text: rawPost.caption.text,
      urlPicture: rawPost.image_versions2.candidates[0].url,
      date: rawPost.device_timestamp
    }
    posts.push(post)
  }

  return posts

}

function prepareUser(rawUser) {

  return {
    id: rawUser.pk,
    fullName: rawUser.full_name,
    userName: rawUser.username
  }

}

module.exports = {
  preparePost,
  prepareUser
}
