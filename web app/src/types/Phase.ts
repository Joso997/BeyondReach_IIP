export default class Phase {
  public consequence: [number, number, number, string, number, number][];
  public dialogue: [number, number, string][];
  public constructor () {
    this.consequence = []
    this.dialogue = []
  }
}
