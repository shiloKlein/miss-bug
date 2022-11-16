import { storageService } from './async-storage-service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  saveAsPdf,
}

const BASE_URL = `/api/bug/`

function query(filterBy) {
  console.log();
  // return storageService.query(STORAGE_KEY)
  return axios.get(BASE_URL, { params: filterBy })
    .then(res => {
      console.log('res', res.data);
      return res.data
    })
    .catch(err=>console.log)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId)
    .then(res => res.data)
    .catch(err=>console.log)

  // return storageService.get(STORAGE_KEY, bugId)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId)
    .then(res => res.data)
    .catch(err=>{
      console.log(err)
    })
}


function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL + bug._id, bug).then((res) => res.data)
    .catch(err=>console.log)

  } else {
    console.log('saving new');
    return axios.post(BASE_URL, bug).then((res) => res.data)
    .catch(err=>console.log)
  }
}

function saveAsPdf(bugs) {
  console.log(bugs);
  return axios.post(`${BASE_URL}pdf`, bugs).then((res) => res.data)
  .catch(err=>console.log)
}
