import React, { useState } from 'react'

// import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Rnd } from 'react-rnd'
import { useStore } from 'zustand'

import { generateEvent, formatTime, calcStringTime } from './helpers'
// import SchedulerStore from './scheduleStore'
import { zStore } from './zstore'

// function Store(initialState = {}) {
//   this.state = initialState
// }

// const store = new Store()

// class SchedulerStore {
//   // secondsPassed = 0

//   events = []
//   eventRowMap = []

//   constructor() {
//     makeAutoObservable(this)
//   }

//   addEvent(event) {
//     this.events.push(event)
//   }

//   // increaseTimer() {
//   // this.secondsPassed += 1
//   // }
// }

// const myStore = new SchedulerStore()

// function calcStringTime(str) {
//   const slice = str.split(':')
//   const h = Number(slice[0]) * 60 * 60
//   const i = Number(slice[1]) * 60
//   return h + i
// }

// function formatTime(val) {
//   const i1 = val % 3600

//   const h = '' + (Math.floor(val / 36000) || '') + Math.floor((val / 3600) % 10)
//   const i = '' + Math.floor(i1 / 600) + Math.floor((i1 / 60) % 10)
//   return h + ':' + i
// }

// function addEvent(event) {
//   console.log('addEvent')
//   store.state.data.push(event)
//   const index = store.state.data.length - 1
//   store.state.dataRowMap[event.row].push(index)
// }

// function getGeometry(item) {
//   const startTime = calcStringTime(item.start)
//   const endTime = calcStringTime(item.end)

//   const st = Math.ceil(
//     (startTime - store.state.tableStartTime) / store.state.config.widthTime
//   )
//   const et = Math.floor(
//     (endTime - store.state.tableStartTime) / store.state.config.widthTime
//   )

//   return {
//     x: store.state.config.widthTimeX * st,
//     y: 0,
//     width: store.state.config.widthTimeX * (et - st),
//     height: store.state.config.timeLineY,
//   }
// }

// // update row heights, and manage overlapping events in a row
// function updateGeometries() {
//   store.state.tableHeight = 0

//   for (let rowNum = 0; rowNum < store.state.rows.length; rowNum++) {
//     const items_map = store.state.dataRowMap[rowNum]

//     const events = []
//     for (let i = 0; i < items_map.length; i++) {
//       events.push(store.state.data[items_map[i]])
//     }

//     const codes = [],
//       check = []
//     let h = 0
//     let c1, c2, s1, s2, e1, e2
//     let i

//     const events = zStore((state) => state.events)

//     for (i = 0; i < events.length; i++) {
//       const geometry = getGeometry(events[i]) // TODO: cache this for later use, or precompute
//       events[i]['geometry'] = geometry
//       // TODO: add geometry to zStore? left off here
//       codes[i] = {
//         code: i,
//         x: geometry.x,
//       }
//     }

//     codes.sort(function (a, b) {
//       if (a.x < b.x) {
//         return -1
//       }

//       if (a.x > b.x) {
//         return 1
//       }

//       return 0
//     })

//     for (i = 0; i < codes.length; i++) {
//       c1 = codes[i].code

//       const geometry1 = events[c1].geometry

//       for (h = 0; h < check.length; h++) {
//         let next = false

//         for (let j = 0; j < check[h].length; j++) {
//           c2 = check[h][j]
//           const geometry2 = getGeometry(events[c2])
//           s1 = geometry1.x
//           e1 = geometry1.x + geometry1.width
//           s2 = geometry2.x
//           e2 = geometry2.x + geometry2.width

//           if (s1 < e2 && e1 > s2) {
//             next = true
//             continue
//           }
//         }

//         if (!next) {
//           break
//         }
//       }

//       if (!check[h]) {
//         check[h] = []
//       }

//       events[c1].geometry.y =
//         h * store.state.config.timeLineY + store.state.config.timeLinePaddingTop

//       check[h][check[h].length] = c1
//     }

//     const height =
//       Math.max(check.length, 1) * store.state.config.timeLineY +
//       store.state.config.timeLineBorder +
//       store.state.config.timeLinePaddingTop +
//       store.state.config.timeLinePaddingBottom

//     store.state.rowHeights[rowNum] = height

//     store.state.tableHeight += height
//   }
// }

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

  const config = zStore((state) => state.config)
  const tableStartTime = zStore((state) => state.tableStartTime)
  const tableEndTime = zStore((state) => state.tableEndTime)
  const scrollWidth = zStore((state) => state.scrollWidth)

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

  // const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - store.state.config.dataWidth - store.state.config.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_menu">
      <div className="sc_header_cell" style={{ width: config.dataWidth }}>
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
  // const item = props.event
  // const config = store.state.config
  const config = zStore((state) => state.config)

  // const setGeometry = zStore((state) => state.setGeometry)
  // const geometry = item.geometry

  const geometries = zStore((state) => state.geometries)
  const events = zStore((state) => state.events)

  const item = events[props.eventIndex]
  const geometry = geometries[props.eventIndex]

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
  const rowMap = zStore((state) => state.rowMap)
  const items_map = rowMap[props.rowNum]

  const blankCells = []

  const config = zStore((state) => state.config)
  const tableStartTime = zStore((state) => state.tableStartTime)
  const cellsWide = zStore((state) => state.cellsWide)
  const rowHeights = zStore((state) => state.rowHeights)

  for (let i = 0; i < cellsWide; i++) {
    const time = tableStartTime + i * config.widthTimeX

    blankCells.push(
      <div
        className="tl"
        style={{ width: config.widthTimeX + 'px' }}
        key={i}
        onClick={() => {
          if (config.onScheduleClick) {
            config.onScheduleClick(time, i, props.rowNum)
          }
        }}
        //onKeyPress={this.handleKeyPress}
        role="presentation"
      ></div>
    )
  }

  const data = zStore((state) => state.events)
  // const getGeometry = zStore((state) => state.getGeometry)

  const events = []
  for (let i = 0; i < items_map.length; i++) {
    // console.log(data[items_map[i]], i)
    // const geometry = getGeometry(i)
    events.push(
      <Event
        event={data[items_map[i]]}
        eventIndex={items_map[i]}
        key={items_map[i]}
      />
    )
  }

  const height = rowHeights[props.rowNum]

  return (
    <div className="timeline" style={{ height: height + 'px' }}>
      {blankCells}
      {events}
    </div>
  )
}

const Main = () => {
  const timelines = []
  const titles = []

  const rows = zStore((state) => state.rows)
  const rowHeights = zStore((state) => state.rowHeights)
  const config = zStore((state) => state.config)
  const tableHeight = zStore((state) => state.tableHeight)
  const scrollWidth = zStore((state) => state.scrollWidth)

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

  // const scWidth = window.innerWidth // $this.width()
  // const scMainWidth = scWidth - store.state.config.dataWidth - store.state.config.verticalScrollbar

  const scMainWidth = 960

  return (
    <div className="sc_wrapper">
      <div
        className="sc_data"
        style={{
          height: tableHeight + 'px',
          width: config.dataWidth + 'px',
        }}
      >
        <div
          className="sc_data_scroll"
          style={{ width: config.dataWidth, top: '0' }}
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

const Scheduler = () => {
  // const Scheduler = observer(({ props, myStore }) => {

  // props.store

  // const configDefault = {
  //   className: 'jq-schedule',
  //   rows: {},
  //   startTime: '07:00',
  //   endTime: '19:30',
  //   widthTimeX: 25,
  //   widthTime: 600, // cell timestamp example 10 minutes
  //   timeLineY: 50, // timeline height(px)
  //   timeLineBorder: 1, // timeline height border
  //   timeBorder: 1, // border width
  //   timeLinePaddingTop: 0,
  //   timeLinePaddingBottom: 0,
  //   headTimeBorder: 1, // time border width
  //   dataWidth: 160, // data width
  //   verticalScrollbar: 0, // vertical scrollbar width
  //   bundleMoveWidth: 1,
  //   // width to move all schedules to the right of the clicked time cell
  //   draggable: true,
  //   resizable: true,
  //   resizableLeft: false,
  //   // event
  //   onInitRow: null,
  //   onChange: null,
  //   onClick: null,
  //   onAppendRow: null,
  //   onAppendSchedule: null,
  //   onScheduleClick: null,
  // }

  // const config = { ...configDefault, ...props.config }

  // store.state.config = config

  // store.state.rowHeights = []

  // store.state.tableHeight = 0

  // // TODO: add subtitles to rows
  // store.state.rows = props.rows

  // store.state.tableStartTime = calcStringTime(config.startTime)
  // store.state.tableEndTime = calcStringTime(config.endTime)
  // store.state.tableStartTime -= store.state.tableStartTime % config.widthTime
  // store.state.tableEndTime -= store.state.tableEndTime % config.widthTime

  // store.state.cellsWide = Math.floor(
  //   (store.state.tableEndTime - store.state.tableStartTime) /
  //     store.state.config.widthTime
  // )

  // store.state.scrollWidth =
  //   store.state.config.widthTimeX * store.state.cellsWide

  // store.state.data = props.data

  // const bears = useStore((state) => state.bears)

  // const events = useStore((st) => st.events)

  // const newEvent = generateEvent(store.state) //randomEvent()

  // store.state.data.push(newEvent)

  // store.state.dataRowMap = []
  // for (let j = 0; j < store.state.rows.length; j++) {
  //   // doing this since Array.fill([]) causes issues
  //   store.state.dataRowMap.push([])
  // }
  // for (let i = 0; i < store.state.data.length; i++) {
  //   store.state.dataRowMap[store.state.data[i].row].push(i)
  // }

  // updateGeometries()

  return (
    <>
      <div className="container">
        <div style={{ padding: '0 0 40px' }}>
          <div id="schedule" className="jq-schedule">
            <Menu />
            <Main />
          </div>
        </div>
      </div>
    </>
  )
}

export default observer(Scheduler)
