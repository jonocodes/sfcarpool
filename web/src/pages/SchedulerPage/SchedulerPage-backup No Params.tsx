import React, { useState } from 'react'

import { Rnd } from 'react-rnd'

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

const mysettings = {
  startTime: '06:00', // schedule start time(HH:ii)
  endTime: '10:00', // schedule end time(HH:ii)
  widthTime: 60 * 5,
  timeLineY: 60, // height(px)
  dataWidth: 120,
  verticalScrollbar: 20, // scrollbar (px)
  timeLineBorder: 2, // border(top and bottom)
  bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
  // draggable: isDraggable,
  // resizable: isResizable,
  resizableLeft: true,
  widthTimeX: 20,
}

// TODO: add subtitles
const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const rowHeights = []

let tableHeight = 0

const data = [
  {
    row: 0, // monday
    start: '8:00',
    end: '8:10',
    text: 'JK',
    data: {
      entry: 8,
      class: 'passenger',
      likelihood: 20,
    },
  },
  {
    row: 1, //tuesday
    start: '6:30',
    end: '7:10',
    text: 'Jono',
    data: {
      entry: 4,
      class: 'passenger',
      likelihood: 95,
    },
  },
  {
    row: 1, // tuesday
    start: '7:05',
    end: '7:30',
    text: 'Jodi',
    data: {
      entry: 5,
      class: 'driver',
      likelihood: 70,
    },
  },
  {
    row: 1, // tuesday
    start: '7:40',
    end: '8:50',
    text: 'Jono',
    data: {
      entry: 9,
      class: 'passenger',
      likelihood: 70,
    },
  },
  {
    row: 4, // friday
    start: '8:40',
    end: '8:50',
    text: 'Jono',
    data: {
      entry: 10,
      class: 'passenger',
      likelihood: 70,
    },
  },
]

// const dataRowMap = [[0], [1, 2], [], [], []]

// const dataRowMap = new Array(rows.length).fill([])

const dataRowMap = []
for (let j = 0; j < rows.length; j++) {
  // doing this since Array.fill([]) causes issues
  dataRowMap.push([])
}

console.log(dataRowMap)
// const events = []
for (let i = 0; i < data.length; i++) {
  // if data.includes()
  console.log(data[i])
  dataRowMap[data[i].row].push(i)
  console.log(dataRowMap, data[i].row, i)
  // debugger
  // events.push(data[items_map[i]])
}

console.log(dataRowMap)

const config = { ...configDefault, ...mysettings }

const setting = config

let tableStartTime = calcStringTime(config.startTime)
let tableEndTime = calcStringTime(config.endTime)
tableStartTime -= tableStartTime % config.widthTime
tableEndTime -= tableEndTime % config.widthTime

const cellsWide = Math.floor(
  (tableEndTime - tableStartTime) / setting.widthTime
)

const scrollWidth = setting.widthTimeX * cellsWide

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

function getGeometry(item) {
  const startTime = calcStringTime(item.start)
  const endTime = calcStringTime(item.end)

  const st = Math.ceil((startTime - tableStartTime) / setting.widthTime)
  const et = Math.floor((endTime - tableStartTime) / setting.widthTime)

  // const stext = formatTime(startTime)
  // const etext = formatTime(endTime)

  return {
    x: config.widthTimeX * st,
    y: 0,
    width: config.widthTimeX * (et - st),
    height: config.timeLineY,
  }
}

// update row heights, and manage overlapping events in a row
function updateGeometries() {
  tableHeight = 0

  for (let rowNum = 0; rowNum < rows.length; rowNum++) {
    const items_map = dataRowMap[rowNum]

    const events = []
    for (let i = 0; i < items_map.length; i++) {
      events.push(data[items_map[i]])
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

      events[c1].geometry.y = h * setting.timeLineY + setting.timeLinePaddingTop

      check[h][check[h].length] = c1
    }

    const height =
      Math.max(check.length, 1) * setting.timeLineY +
      setting.timeLineBorder +
      setting.timeLinePaddingTop +
      setting.timeLinePaddingBottom

    rowHeights[rowNum] = height

    tableHeight += height
  }
}

function _resizeWindow() {
  // var $this = $(this);

  // const setting = methods._loadSettingData.apply($this)

  // const saveData = methods._loadData.apply($this)

  const scWidth = window.innerWidth // $this.width()
  const scMainWidth = scWidth - setting.dataWidth - setting.verticalScrollbar
  const cellNum = Math.floor(
    (tableEndTime - tableStartTime) / setting.widthTime
  )
  $this.find('.sc_header_cell').width(setting.dataWidth)
  $this.find('.sc_data,.sc_data_scroll').width(setting.dataWidth)
  $this.find('.sc_header').width(scMainWidth)
  $this.find('.sc_main_box').width(scMainWidth)
  $this.find('.sc_header_scroll').width(setting.widthTimeX * cellNum)
  $this.find('.sc_main_scroll').width(setting.widthTimeX * cellNum)
}

const Menu = () => {
  const final = []

  let beforeTime = -1

  for (let t = tableStartTime; t < tableEndTime; t += config.widthTime) {
    if (
      beforeTime < 0 ||
      Math.floor(beforeTime / 3600) !== Math.floor(t / 3600)
    ) {
      const cn = Number(
        Math.min(
          Math.ceil((t + config.widthTime) / 3600) * 3600,
          tableEndTime
        ) - t
      )
      const cellNum = Math.floor(cn / config.widthTime)
      const width = cellNum * config.widthTimeX

      final.push(
        <div className="sc_time" style={{ width: width + 'px' }} key={t}>
          {formatTime(t)}
        </div>
      )

      beforeTime = t
    }
  }

  const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - setting.dataWidth - setting.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_menu">
      <div className="sc_header_cell" style={{ width: setting.dataWidth }}>
        <span>&nbsp;</span>
      </div>
      <div className="sc_header" style={{ width: scMainWidth + 'px' }}>
        <div className="sc_header_scroll" style={{ width: scrollWidth + 'px' }}>
          {final}
        </div>
      </div>
    </div>
  )
}

const Event = (props) => {
  const item = props.event

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
  const items_map = dataRowMap[props.rowNum]

  const blankCells = []

  for (let i = 0; i < cellsWide; i++) {
    blankCells.push(
      <div
        className="tl"
        style={{ width: config.widthTimeX + 'px' }}
        key={i}
      ></div>
    )
  }

  const events = []
  for (let i = 0; i < items_map.length; i++) {
    // console.log(data[items_map[i]], i)
    events.push(<Event event={data[items_map[i]]} key={items_map[i]} />)
  }

  const height = rowHeights[props.rowNum]

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

  for (let i = 0; i < rows.length; i++) {
    timelines.push(<Row rowNum={i} key={i} />)
    titles.push(
      <div
        className="timeline"
        style={{ height: rowHeights[i] + 'px' }}
        key={i}
      >
        <span className="timeline-title">{rows[i]}</span>
      </div>
    )
  }

  const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - setting.dataWidth - setting.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_wrapper">
      <div
        className="sc_data"
        style={{ height: tableHeight + 'px', width: setting.dataWidth + 'px' }}
      >
        <div
          className="sc_data_scroll"
          style={{ width: setting.dataWidth, top: '0' }}
        >
          {titles}
        </div>
      </div>
      <div className="sc_main_box" style={{ width: scMainWidth + 'px' }}>
        <div className="sc_main_scroll" style={{ width: scrollWidth + 'px' }}>
          <div className="sc_main">{timelines}</div>
        </div>
      </div>
    </div>
  )
}

const SchedulerPage = () => {
  updateGeometries()

  const mysettings111 = {
    startTime: '06:00', // schedule start time(HH:ii)
    endTime: '10:00', // schedule end time(HH:ii)
    widthTime: 60 * 5,
    timeLineY: 60, // height(px)
    dataWidth: 120,
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,
    resizableLeft: true,
    widthTimeX: 20,
  }

  return (
    <>
      <h1>SchedulerPage</h1>

      <div className="container">
        <div style={{ padding: '0 0 40px' }}>
          <div id="schedule" className="jq-schedule">
            {/* <Raw /> */}
            <Menu />
            <Wrapper />
          </div>
        </div>
      </div>
    </>
  )
}

export default SchedulerPage
