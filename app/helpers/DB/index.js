const DB = {}

DB.get = (query) => {
  console.log('DB.get FETCH:', query)
  return new Promise((resolve, reject) => {
    fetch(query, {
      method: 'get'
    })
    .then(response => {
      const json = response.json()
      console.log('DB.get RESPONSE:', response.status)
      resolve(json)
    })
    .catch(error => {
      console.error('DB.get ERROR:', error)
      reject(error)
    })
  })
}

export default DB
