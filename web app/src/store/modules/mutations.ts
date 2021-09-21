import State from '../../types/State'

const increment = (state: State) => {
  state.count++
}
const GET_DBFILE = (state: State, dbFile: string) => {
  console.log('begin GET_DBFILE mutations in store')
  state.dbFile = dbFile
  console.log('this length ' + state.dbFile.length)
  console.log('end GET_DBFILE mutations in store')
}

export default {
  increment,
  GET_DBFILE
}
