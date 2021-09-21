export default class State {
  public dbFile: string;
  public db: {};
  public values: {};
  public count: number;
  public constructor () {
    this.dbFile = ''
    this.db = {}
    this.values = {}
    this.count = 0
  }
}
