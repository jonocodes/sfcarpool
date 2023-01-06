import React, { useContext, useState } from 'react'

// import { makeAutoObservable } from 'mobx'
// import { observer } from 'mobx-react-lite'
import { Rnd } from 'react-rnd'
import { useStore } from 'zustand'

// import { SchedulerContext } from 'src/pages/SchedulerPage/SchedulerPage'

import { formatTime, calcStringTime } from './helpers'
// import { Event } from './types'
import { SchedulerContext } from './zstore'
import { _generateEvent } from './zstore'

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

function formatTimeSpan(start: number, end: number) {
  console.log(
    'format time span called ',
    formatTime(start) + '-' + formatTime(end)
  )
  return formatTime(start) + '-' + formatTime(end)
}

const Event = (props) => {
  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const store = getStore(SchedulerContext)

  const config = useStore(store, (state) => state.config)
  const updateEvent = useStore(store, (state) => state.updateEvent)

  const geometries = useStore(store, (state) => state.computed.geometries)
  const events = useStore(store, (state) => state.events)
  const computed = useStore(store, (state) => state.computed)

  // const event = events[props.eventIndex]
  // const geometry = geometries[props.eventIndex]
  // const height = config.timeLineY

  // const [startTime, setStartTime] = useState(
  //   // 0
  //   calcStringTime(events[props.eventIndex].start)
  // )
  // const [endTime, setEndTime] = useState(
  //   // 0
  //   calcStringTime(events[props.eventIndex].end)
  //   // calcStringTime(props.event.end)
  // )

  // const newTime = formatTimeSpan(
  //   calcStringTime(events[props.eventIndex].start),
  //   calcStringTime(events[props.eventIndex].end)
  // )

  const [timeStr, setTimeStr] = useState(
    // 'X'
    // newTime
    formatTimeSpan(
      calcStringTime(events[props.eventIndex].start),
      calcStringTime(events[props.eventIndex].end)
    )
  )

  // const [width, setWidth] = useState(geometries[props.eventIndex].width)

  const tableStartTime = calcStringTime(config.startTime)

  // function onEventSave(event: Event, eventIndex): void {
  //   formatTimeSpan(calcStringTime(event.start), calcStringTime(event.end))
  // }

  // useEffect(() => {
  //   console.log(
  //     '  useEffect triggered ',
  //     dirty,
  //     formatEventTimeSpan(events[props.eventIndex])
  //   )

  //   if (!dirty) {
  //     setEndTime(calcStringTime(events[props.eventIndex].end))
  //     setStartTime(calcStringTime(events[props.eventIndex].start))
  //     setTimeStr(formatEventTimeSpan(events[props.eventIndex]))
  //   }
  // }) //, [props.eventIndex, events])

  console.log(
    'Event',
    props,
    events[props.eventIndex],
    props.event.end,
    // formatTime(endTime),
    timeStr
  )

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
        x: geometries[props.eventIndex].x,
        y: geometries[props.eventIndex].y,
        width: geometries[props.eventIndex].width,
        height: config.timeLineY,
      }}
      position={{
        x: geometries[props.eventIndex].x,
        y: geometries[props.eventIndex].y,
      }}
      size={{
        width: geometries[props.eventIndex].width,
        height: config.timeLineY,
      }}
      // TODO: use config.draggable and config.resizable flags here

      minWidth={config.widthTimeX}
      minHeight={config.timeLineY}
      maxHeight={config.timeLineY}
      dragGrid={[config.widthTimeX, 1]}
      // resizeGrid={[config.widthTimeX, 1]}
      resizeGrid={[config.widthTimeX, 1]}
      enableResizing={{
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onDrag={(e, data) => {
        const offset = (data.x / config.widthTimeX) * config.widthTime

        const lengthTime =
          calcStringTime(events[props.eventIndex].end) -
          calcStringTime(events[props.eventIndex].start)

        const startT = tableStartTime + offset
        const endT = tableStartTime + offset + lengthTime
        // (geometries[props.eventIndex].width / config.widthTimeX) *
        // config.widthTime

        console.log('onDrag', data, offset, formatTime(startT))
        // setStartTime(startT)
        // setEndTime(endT)

        events[props.eventIndex].start = formatTime(startT)
        events[props.eventIndex].end = formatTime(endT)

        const newTime = formatTimeSpan(startT, endT)
        setTimeStr(newTime)
      }}
      onDragStart={(e, data) => {
        console.log('onDragStart', data)
      }}
      onDragStop={(e, data) => {
        const deltaX = data.lastX - geometries[props.eventIndex].x
        const deltaY = data.lastY - geometries[props.eventIndex].y

        console.log(
          'onDragStop',
          e,
          data,
          deltaX,
          deltaY,
          data.lastX,
          data.lastY
        )

        // handle the case where the drag seems like a click
        if (deltaX == 0 && deltaY == 0) {
          console.log(
            'that drag seemed like a click!',
            deltaX,
            config.widthTimeX
          )
          if (config.onClick) {
            config.onClick(
              events[props.eventIndex],
              props.rowNum,
              props.eventIndex
            )
          }
        } else {
          // handle time change

          // const deltaTime = (deltaX / config.widthTimeX) * config.widthTime

          // const startTime = calcStringTime(events[props.eventIndex].start)
          // const endTime = calcStringTime(events[props.eventIndex].end)

          // const startT = startTime + deltaTime
          // const endT = endTime + deltaTime

          // // setX(data.lastX)   // geometry updates should handle this

          // // setStartTime(startT)
          // // setEndTime(endT)

          // events[props.eventIndex].start = formatTime(startT)
          // events[props.eventIndex].end = formatTime(endT)

          // handle row switching
          let origTopY = 0

          for (let i = 0; i < events[props.eventIndex].row; i++) {
            origTopY += computed.rowHeights[i]
            console.log(origTopY)
          }

          const newTopY = origTopY + data.lastY

          let newRow = 0

          let currentY = computed.rowHeights[newRow]

          while (currentY <= newTopY + config.timeLineY / 2) {
            newRow += 1
            currentY += computed.rowHeights[newRow]
          }

          events[props.eventIndex].row = newRow

          updateEvent(props.eventIndex, events[props.eventIndex])
        }

        console.log('onDragStop completed')
      }}
      // onResizeStart={(e, dir, ref) => {
      //   console.log('onResizeStart', dir)
      //   dirty = true
      // }}

      onResize={(e, dir, ref, delta, pos) => {
        console.log('onResize', dir, delta, pos, ref)

        // using ref width to workaround https://github.com/bokuweb/react-rnd/issues/901

        const widthTime =
          (ref.offsetWidth / config.widthTimeX) * config.widthTime

        if (dir === 'right') {
          // if (resizeRight !== delta.width) {

          events[props.eventIndex].end = formatTime(
            calcStringTime(events[props.eventIndex].start) + widthTime
          )

          // setResizeRight(delta.width)
          // }
        } else {
          // const widthTime =
          //   (ref.offsetWidth / config.widthTimeX) * config.widthTime

          events[props.eventIndex].start = formatTime(
            calcStringTime(events[props.eventIndex].end) - widthTime
          )
        }

        const newTime = formatTimeSpan(
          calcStringTime(events[props.eventIndex].start),
          calcStringTime(events[props.eventIndex].end)
        )
        // not sure why setting this unused var causes update to events, but its needed to show resize times live
        setTimeStr(newTime)
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        const deltaTime = (delta.width / config.widthTimeX) * config.widthTime

        console.log('onResizeStop', dir, delta, pos, deltaTime)

        updateEvent(props.eventIndex, events[props.eventIndex])
      }}
    >
      <div
        className={`sc_bar ${events[props.eventIndex].data.class}  ${
          events[props.eventIndex].data.mode
        }`}
        style={{
          width: '100%',
          height: config.timeLineY + 'px',
        }}
      >
        <span className="head">
          <span className="time">
            {events[props.eventIndex].start} - {events[props.eventIndex].end}
          </span>
        </span>
        <span className="text">{events[props.eventIndex].text}</span>
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
  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  const rowMap = useStore(store, (state) => state.computed.rowMap)
  const items_map = rowMap[props.rowNum]

  // const geometries = useStore(store, (state) => state.computed.geometries)

  const blankCells = []

  const config = useStore(store, (state) => state.config)

  const cellsWide = useStore(store, (state) => state.computed.cellsWide)
  const rowHeights = useStore(store, (state) => state.computed.rowHeights)

  // console.log('row', props.rowNum)

  for (let i = 0; i < cellsWide; i++) {
    blankCells.push(
      <div
        className="tl"
        style={{ width: config.widthTimeX + 'px' }}
        key={i}
        onClick={() => {
          // // const rows = zStore.getState().rows
          // // const rows = useStore(store, (state) => state.rows)
          // // const tableStartTime = useStore(store, (state) => state.tableStartTime)
          // // const tableEndTime = useStore(store, (state) => state.tableEndTime)
          // // const config = useStore(store, (state) => state.config)
          // const times = getTimeSlots(
          //   tableStartTime,
          //   tableEndTime,
          //   config.widthTime
          // )
          // const randEvent = _generateEvent(times, rows.length)
          // const randEvent = generateEvent()
          // myStore.addEvent(randEvent)
          // addEvent(randEvent)
          // if (config.onScheduleClick) {
          //   config.onScheduleClick(time, i, props.rowNum)
          // }

          if (config.onScheduleClick) {
            config.onScheduleClick(1234, i, props.rowNum)
          }
        }}
        //onKeyPress={this.handleKeyPress}
        role="presentation"
      ></div>
    )
  }

  const events = useStore(store, (state) => state.events)
  // const getGeometry = useStore(store, (state) => state.getGeometry)

  const eventBlocks = []
  for (let i = 0; i < items_map.length; i++) {
    const eventIndex = items_map[i]
    // console.log(data[items_map[i]], i)
    // const geometry = getGeometry(i)
    eventBlocks.push(
      <Event
        event={events[eventIndex]}
        eventIndex={eventIndex}
        key={eventIndex}
        // geometry={geometries[eventIndex]}
      />
    )
  }

  const height = rowHeights[props.rowNum]

  return (
    <div className="timeline" style={{ height: height + 'px' }}>
      {blankCells}
      {eventBlocks}
    </div>
  )
}

const Menu = () => {
  const final = []

  let beforeTime = -1

  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  const config = useStore(store, (state) => state.config)
  const tableStartTime = useStore(
    store,
    (state) => state.computed.tableStartTime
  )
  const tableEndTime = useStore(store, (state) => state.computed.tableEndTime)
  const scrollWidth = useStore(store, (state) => state.computed.scrollWidth)

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

  return (
    <div className="sc_menu" style={{ display: 'flex', flexDirection: 'row' }}>
      <div
        className="sc_header"
        style={{
          flex: 'auto',
        }}
      >
        <div
          className="sc_header_scroll"
          id="sc_header_scroll"
          style={{ width: scrollWidth + 'px' }}
        >
          {final}
        </div>
      </div>
    </div>
  )
}

const Main = () => {
  const timelines = []
  const titles = []

  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  const rows = useStore(store, (state) => state.rows)
  const rowHeights = useStore(store, (state) => state.computed.rowHeights)
  const config = useStore(store, (state) => state.config)
  // const tableHeight = useStore(store, (state) => state.computed.tableHeight)
  const scrollWidth = useStore(store, (state) => state.computed.scrollWidth)

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

  return (
    <div className="sc_wrapper" style={{ display: 'flex' }}>
      <div
        className="sc_data"
        style={{
          width: config.dataWidth + 'px',
          flexShrink: 0,
        }}
      >
        <div
          className="sc_header_cell"
          style={{
            width: config.dataWidth,
          }}
        >
          <span>&nbsp;</span>
        </div>
        <div
          className="sc_data_scroll"
          style={{ width: config.dataWidth, top: '0' }}
        >
          {titles}
        </div>
      </div>
      <div
        className="sc_main_box"
        //style={{ overflowY: 'hidden' }}
      >
        <div className="sc_main_scroll" style={{ width: scrollWidth + 'px' }}>
          <Menu />
          <div className="sc_main">{timelines}</div>
        </div>
      </div>
    </div>
  )
}

const Scheduler = () => {
  return (
    <>
      <div className="container">
        <div style={{ padding: '10px 0 40px' }}>
          <div id="schedule" className="jq-schedule">
            <Main />
          </div>
        </div>
      </div>
    </>
  )
}

export default Scheduler
