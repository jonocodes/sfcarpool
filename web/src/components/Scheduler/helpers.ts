export function formatTime(val) {
  const i1 = val % 3600

  const h = '' + (Math.floor(val / 36000) || '') + Math.floor((val / 3600) % 10)
  const i = '' + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10)
  return h + ':' + i
}

function randInt(x, y) {
  return x + Math.floor(Math.random() * y)
}

function getTimeSlots(tableStartTime, tableEndTime, widthTime) {
  // TODO: this should read from args, not the global state

  let time = tableStartTime
  // const times = [formatTime(time)]
  const times = [time]
  while (time < tableEndTime) {
    // console.log(time)
    time = time + widthTime
    // times.push(formatTime(time))
    times.push(time)
  }

  return times
}

function _generateEvent(times, rowCount) {
  // TODO: this should read from args, not the global state

  const randStartIndex = Math.floor(Math.random() * times.length)
  const randEndIndex = randStartIndex + 2 + Math.floor(Math.random() * 8)

  const event = {
    row: randInt(0, rowCount),
    start: formatTime(times[randStartIndex]),
    end: formatTime(times[randEndIndex]),
    text: 'random',
    data: {
      entry: randInt(0, 1000),
      class: 'passenger',
      likelihood: randInt(50, 100),
    },
  }

  console.log(event)

  return event
}

export function generateEvent(
  tableStartTime,
  tableEndTime,
  widthTime,
  rowCount
) {
  const times = getTimeSlots(tableStartTime, tableEndTime, widthTime)

  return _generateEvent(times, store.rows.length)
}

export function calcStringTime(str) {
  const slice = str.split(':')
  const h = Number(slice[0]) * 60 * 60
  const i = Number(slice[1]) * 60
  return h + i
}
