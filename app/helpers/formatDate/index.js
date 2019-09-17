tokenise = (name) => {
  return name.toLowerCase().split(' ').join('-')
}

export default tokenise
