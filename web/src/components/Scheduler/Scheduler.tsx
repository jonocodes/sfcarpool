import React, { useState } from 'react'

import { Rnd } from 'react-rnd'

import HomePageStories from 'src/pages/HomePage/HomePage.stories'

function Store(initialState = {}) {
  this.state = initialState
}

const store = new Store()

function calcStringTime(str) {
  const slice = str.split(':')
  const h = Number(slice[0]) * 60 * 60
  const i = Number(slice[1]) * 60
  return h + i
}

function formatTime(val) {
  const i1 = val % 3600

  const h = '' + (Math.floor(val / 36000) || '') + Math.floor((val / 3600) % 10)
  const i = '' + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10)
  return h + ':' + i
}

function getTimeSlots(startTime, endTime) {
  // TODO: this should read from args, not the global state

  let time = store.state.tableStartTime
  // const times = [formatTime(time)]
  const times = [time]
  while (time < store.state.tableEndTime) {
    // console.log(time)
    time = time + store.state.config.widthTime
    // times.push(formatTime(time))
    times.push(time)
  }

  return times
}

function randInt(x, y) {
  return x + Math.floor(Math.random() * y)
}

function randomEvent(rows) {
  // TODO: this should read from args, not the global state

  const times = getTimeSlots(435, 1231)

  const randStartIndex = Math.floor(Math.random() * times.length)
  const randEndIndex = randStartIndex + 2 + Math.floor(Math.random() * 8)

  // console.log(times)

  const event = {
    row: randInt(0, store.state.rows.length),
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

function getGeometry(item) {
  const startTime = calcStringTime(item.start)
  const endTime = calcStringTime(item.end)

  const st = Math.ceil(
    (startTime - store.state.tableStartTime) / store.state.config.widthTime
  )
  const et = Math.floor(
    (endTime - store.state.tableStartTime) / store.state.config.widthTime
  )

  return {
    x: store.state.config.widthTimeX * st,
    y: 0,
    width: store.state.config.widthTimeX * (et - st),
    height: store.state.config.timeLineY,
  }
}

// update row heights, and manage overlapping events in a row
function updateGeometries() {
  store.state.tableHeight = 0

  for (let rowNum = 0; rowNum < store.state.rows.length; rowNum++) {
    const items_map = store.state.dataRowMap[rowNum]

    const events = []
    for (let i = 0; i < items_map.length; i++) {
      events.push(store.state.data[items_map[i]])
    }

    const codes = [],
      check = []
    let h = 0
    let c1, c2, s1, s2, e1, e2
    let i

    for (i = 0; i < events.length; i++) {
      const geometry = getGeometry(events[i]) // TODO: cache this for later use, or precompute
      events[i]['geometry'] = geometry
      codes[i] = {
        code: i,
        x: geometry.x,
      }
    }

    codes.sort(function (a, b) {
      if (a.x < b.x) {
        return -1
      }

      if (a.x > b.x) {
        return 1
      }

      return 0
    })

    for (i = 0; i < codes.length; i++) {
      c1 = codes[i].code
      // const geometry1 = getGeometry(events[c1])

      const geometry1 = events[c1].geometry //  getGeometry(events[c1])

      // $e1 = $($barList[c1])

      for (h = 0; h < check.length; h++) {
        let next = false

        for (let j = 0; j < check[h].length; j++) {
          c2 = check[h][j]
          const geometry2 = getGeometry(events[c2])
          s1 = geometry1.x
          e1 = geometry1.x + geometry1.width
          s2 = geometry2.x
          e2 = geometry2.x + geometry2.width

          if (s1 < e2 && e1 > s2) {
            next = true
            continue
          }
        }

        if (!next) {
          break
        }
      }

      if (!check[h]) {
        check[h] = []
      }

      events[c1].geometry.y =
        h * store.state.config.timeLineY + store.state.config.timeLinePaddingTop

      check[h][check[h].length] = c1
    }

    const height =
      Math.max(check.length, 1) * store.state.config.timeLineY +
      store.state.config.timeLineBorder +
      store.state.config.timeLinePaddingTop +
      store.state.config.timeLinePaddingBottom

    store.state.rowHeights[rowNum] = height

    store.state.tableHeight += height
  }
}

// function _resizeWindow() {
//   // var $this = $(this);

//   // const setting = methods._loadSettingData.apply($this)

//   // const saveData = methods._loadData.apply($this)

//   const scWidth = window.innerWidth // $this.width()
//   const scMainWidth =
//     scWidth -
//     store.state.config.dataWidth -
//     store.state.config.verticalScrollbar
//   const cellNum = Math.floor(
//     (tableEndTime - tableStartTime) / store.state.config.widthTime
//   )
//   $this.find('.sc_header_cell').width(store.state.config.dataWidth)
//   $this.find('.sc_data,.sc_data_scroll').width(store.state.config.dataWidth)
//   $this.find('.sc_header').width(scMainWidth)
//   $this.find('.sc_main_box').width(scMainWidth)
//   $this.find('.sc_header_scroll').width(store.state.config.widthTimeX * cellNum)
//   $this.find('.sc_main_scroll').width(store.state.config.widthTimeX * cellNum)
// }

const Menu = () => {
  const final = []

  let beforeTime = -1

  for (
    let t = store.state.tableStartTime;
    t < store.state.tableEndTime;
    t += store.state.config.widthTime
  ) {
    if (
      beforeTime < 0 ||
      Math.floor(beforeTime / 3600) !== Math.floor(t / 3600)
    ) {
      const cn = Number(
        Math.min(
          Math.ceil((t + store.state.config.widthTime) / 3600) * 3600,
          store.state.tableEndTime
        ) - t
      )
      const cellNum = Math.floor(cn / store.state.config.widthTime)
      const width = cellNum * store.state.config.widthTimeX

      final.push(
        <div className="sc_time" style={{ width: width + 'px' }} key={t}>
          {formatTime(t)}
        </div>
      )

      beforeTime = t
    }
  }

  const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - store.state.config.dataWidth - store.state.config.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_menu">
      <div
        className="sc_header_cell"
        style={{ width: store.state.config.dataWidth }}
      >
        <span>&nbsp;</span>
      </div>
      <div className="sc_header" style={{ width: scMainWidth + 'px' }}>
        <div
          className="sc_header_scroll"
          style={{ width: store.state.scrollWidth + 'px' }}
        >
          {final}
        </div>
      </div>
    </div>
  )
}

const Event = (props) => {
  const item = props.event
  const config = store.state.config

  const geometry = item.geometry

  const [startTime, setStartTime] = useState(calcStringTime(item.start))
  const [endTime, setEndTime] = useState(calcStringTime(item.end))

  const [resizeRight, setResizeRight] = useState(0)
  const [resizeLeft, setResizeLeft] = useState(0)

  const timeStr =
    formatTime(startTime + resizeLeft) + '-' + formatTime(endTime + resizeRight)

  return (
    <Rnd
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px #ddd',
        background: '#f0f0f0',
        zIndex: 80,
      }}
      default={{
        x: geometry.x,
        y: geometry.y,
        width: geometry.width,
        height: geometry.height,
      }}
      minWidth={config.widthTimeX}
      minHeight={config.timeLineY}
      maxHeight={config.timeLineY}
      dragGrid={[config.widthTimeX, config.timeLineY]}
      resizeGrid={[config.widthTimeX, 1]}
      onDrag={(e, d) => {
        console.log('onDrag', d)
        const delta = (d.deltaX / config.widthTimeX) * config.widthTime
        setStartTime(startTime + delta)
        setEndTime(endTime + delta)
      }}
      onResize={(e, dir, ref, delta, pos) => {
        console.log('onResize', dir, delta, pos)
        const deltaTime = (delta.width / config.widthTimeX) * config.widthTime
        if (dir === 'right') {
          setResizeRight(deltaTime)
        } else {
          setResizeLeft(deltaTime)
        }
      }}
    >
      <div
        className="sc_bar"
        style={{
          width: '100%',
          height: config.timeLineY + 'px',
        }}
      >
        <span className="head">
          <span className="time">{timeStr}</span>
        </span>
        <span className="text">{item.text}</span>
        <div
          className="ui-resizable-handle ui-resizable-e"
          style={{ zIndex: '90' }}
        ></div>
        <div
          className="ui-resizable-handle ui-resizable-w"
          style={{ zIndex: '90' }}
        ></div>
      </div>
    </Rnd>
  )
}

const Row = (props) => {
  const items_map = store.state.dataRowMap[props.rowNum]

  const blankCells = []

  for (let i = 0; i < store.state.cellsWide; i++) {
    blankCells.push(
      <div
        className="tl"
        style={{ width: store.state.config.widthTimeX + 'px' }}
        key={i}
      ></div>
    )
  }

  const events = []
  for (let i = 0; i < items_map.length; i++) {
    // console.log(data[items_map[i]], i)
    events.push(
      <Event event={store.state.data[items_map[i]]} key={items_map[i]} />
    )
  }

  const height = store.state.rowHeights[props.rowNum]

  return (
    <div className="timeline" style={{ height: height + 'px' }}>
      {blankCells}
      {events}
    </div>
  )
}

const Wrapper = () => {
  const timelines = []
  const titles = []

  for (let i = 0; i < store.state.rows.length; i++) {
    timelines.push(<Row rowNum={i} key={i} />)
    titles.push(
      <div
        className="timeline"
        style={{ height: store.state.rowHeights[i] + 'px' }}
        key={i}
      >
        <span className="timeline-title">{store.state.rows[i]}</span>
      </div>
    )
  }

  const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - store.state.config.dataWidth - store.state.config.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_wrapper">
      <div
        className="sc_data"
        style={{
          height: store.state.tableHeight + 'px',
          width: store.state.config.dataWidth + 'px',
        }}
      >
        <div
          className="sc_data_scroll"
          style={{ width: store.state.config.dataWidth, top: '0' }}
        >
          {titles}
        </div>
      </div>
      <div className="sc_main_box" style={{ width: scMainWidth + 'px' }}>
        <div
          className="sc_main_scroll"
          style={{ width: store.state.scrollWidth + 'px' }}
        >
          <div className="sc_main">{timelines}</div>
        </div>
      </div>
    </div>
  )
}

const Scheduler = (props) => {
  const configDefault = {
    className: 'jq-schedule',
    rows: {},
    startTime: '07:00',
    endTime: '19:30',
    widthTimeX: 25,
    widthTime: 600, // cell timestamp example 10 minutes
    timeLineY: 50, // timeline height(px)
    timeLineBorder: 1, // timeline height border
    timeBorder: 1, // border width
    timeLinePaddingTop: 0,
    timeLinePaddingBottom: 0,
    headTimeBorder: 1, // time border width
    dataWidth: 160, // data width
    verticalScrollbar: 0, // vertical scrollbar width
    bundleMoveWidth: 1,
    // width to move all schedules to the right of the clicked time cell
    draggable: true,
    resizable: true,
    resizableLeft: false,
    // event
    onInitRow: null,
    onChange: null,
    onClick: null,
    onAppendRow: null,
    onAppendSchedule: null,
    onScheduleClick: null,
  }

  const config = { ...configDefault, ...props.config }

  store.state.config = config

  store.state.rowHeights = []

  store.state.tableHeight = 0

  // TODO: add subtitles to rows
  store.state.rows = props.rows

  store.state.tableStartTime = calcStringTime(config.startTime)
  store.state.tableEndTime = calcStringTime(config.endTime)
  store.state.tableStartTime -= store.state.tableStartTime % config.widthTime
  store.state.tableEndTime -= store.state.tableEndTime % config.widthTime

  store.state.cellsWide = Math.floor(
    (store.state.tableEndTime - store.state.tableStartTime) /
      store.state.config.widthTime
  )

  store.state.scrollWidth =
    store.state.config.widthTimeX * store.state.cellsWide

  store.state.data = props.data

  const newEvent = randomEvent(123123)

  store.state.data.push(newEvent)

  store.state.dataRowMap = []
  for (let j = 0; j < store.state.rows.length; j++) {
    // doing this since Array.fill([]) causes issues
    store.state.dataRowMap.push([])
  }
  for (let i = 0; i < store.state.data.length; i++) {
    store.state.dataRowMap[store.state.data[i].row].push(i)
  }

  updateGeometries()

  return (
    <>
      {/* <h1>Scheduler component</h1> */}

      <div className="container">
        <div style={{ padding: '0 0 40px' }}>
          <div id="schedule" className="jq-schedule">
            <Menu />
            <Wrapper />
          </div>
        </div>
      </div>
    </>
  )
}

export default Scheduler
