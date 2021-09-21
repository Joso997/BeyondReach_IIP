type DBFileIsLoadedType = () => void;
type DBFileGetDataType = (sql: string) => void;

export default class DBFile {
  public DBFileIsLoaded: DBFileIsLoadedType;
  public DBFileGetData: DBFileGetDataType;

  constructor (_dBFileIsLoaded: DBFileIsLoadedType, _dBFileGetData: DBFileGetDataType) {
    this.DBFileIsLoaded = _dBFileIsLoaded
    this.DBFileGetData = _dBFileGetData
  }
}
