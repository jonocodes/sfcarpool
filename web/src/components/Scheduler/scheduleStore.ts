import { action, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { generateEvent } from './helpers'

class SchedulerStore {
  // secondsPassed = 0

  events = []
  eventRowMap = []

  constructor() {
    makeAutoObservable(this)
  }

  // @action
  addEvent(event) {
    this.events.push(event)
  }

  // increaseTimer() {
  // this.secondsPassed += 1
  // }
}

export default SchedulerStore
