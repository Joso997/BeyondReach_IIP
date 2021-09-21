import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import DBFile from '../../types/DBFile'
Vue.use(VueAxios, axios)

type commitType = (msg: string, msg2: string) => void;
const getDBFile = ({ commit }: {commit: commitType}, { self }: {self: DBFile}) => {
  console.log('begin getDBFile')
  // Vue.http.get('http://localhost:8080/assets/mytest.db', {responseType: 'arraybuffer'})
  axios.get('/OnlineDatabase.db', { responseType: 'arraybuffer' })
    .then((response) => {
      console.log('begin http.get')
      console.log(response)
      console.log('end http.get')
      const rawDataDBFile = new Uint8Array(response.data)

      console.log('begin data')
      console.log('data length ' + rawDataDBFile.length)
      // console.log(mymdata)
      console.log('end data')
      const dataDBFile = []
      for (let i = 0; i < rawDataDBFile.length; ++i) {
        dataDBFile[i] = String.fromCharCode(rawDataDBFile[i])
      }

      commit('GET_DBFILE', dataDBFile.join(''))

      self.DBFileIsLoaded()
      console.log('end getDBFile in store')
    })
    .catch((error) => {
      console.log('begin error')
      console.log(error)
      console.log('end error')
    })
  console.log('end getDBFile')
}
const nextChild = ({ commit }: {commit: commitType}, { idxChildNext }: {idxChildNext: string}) => {
  commit('NEXT_CHILD', idxChildNext)
}
export default {
  getDBFile,
  nextChild
}
