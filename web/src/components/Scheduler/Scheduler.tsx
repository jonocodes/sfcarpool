import React, { useContext, useEffect, useState } from 'react'

// import { makeAutoObservable } from 'mobx'
// import { observer } from 'mobx-react-lite'
import { Rnd } from 'react-rnd'
import { useStore } from 'zustand'

// import { SchedulerContext } from 'src/pages/SchedulerPage/SchedulerPage'

import { formatTime, calcStringTime } from './helpers'
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

const Event = (props) => {
  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const store = getStore(SchedulerContext)

  const config = useStore(store, (state) => state.config)
  const updateEvent = useStore(store, (state) => state.updateEvent)

  const geometries = useStore(store, (state) => state.computed.geometries)
  const events = useStore(store, (state) => state.events)
  const computed = useStore(store, (state) => state.computed)

  const event = events[props.eventIndex]
  const geometry = geometries[props.eventIndex]

  const [startTime, setStartTime] = useState(
    calcStringTime(events[props.eventIndex].start)
  )
  const [endTime, setEndTime] = useState(calcStringTime(event.end))

  const [timeStr, setTimeStr] = useState(
    formatTime(startTime) + '-' + formatTime(endTime)
  )

  // const [y, setY] = useState(geometry.y)
  // const [y, _] = useState(props.geometry.y)
  // const [x, setX] = useState(geometry.x)
  const [width, setWidth] = useState(geometry.width)

  const tableStartTime = calcStringTime(config.startTime)

  // const modalVisible = usePageStore((state) => state.modalVisible)
  // const showModal = usePageStore((state) => state.showModal)
  // const hideModal = usePageStore((state) => state.hideModal)
  // document.getElementById('exampleModal')

  // const [geo, setGeo] = useState(geometry)

  // const [geo2, setGeo2] = useState(computed.geometries[props.eventIndex])

  // useEffect(() => {
  //   setGeo(() => geometries[props.eventIndex])
  //   // setCalculation(() => count * 2);
  // }, [geometry]) // <- add the count variable here

  console.log(
    'Event',
    props,
    // x,
    // y,
    // computed,
    // geometries,
    geometries[props.eventIndex].x
    // geo2.x
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
        x: geometries[props.eventIndex].x, //x
        y: geometries[props.eventIndex].y,
        width: width,
        height: geometry.height,
      }}
      position={{
        x: geometries[props.eventIndex].x,
        // x: geo2.x, // x,
        y: geometries[props.eventIndex].y, //y,
      }}
      size={{ width: width, height: geometry.height }}
      // TODO: use config.draggable and config.resizable flags here

      minWidth={config.widthTimeX}
      minHeight={config.timeLineY}
      maxHeight={config.timeLineY}
      dragGrid={[config.widthTimeX, 1]}
      resizeGrid={[config.widthTimeX, 1]}
      onDrag={(e, data) => {
        // if (config.draggable) {

        const offset = (data.x / config.widthTimeX) * config.widthTime

        console.log('onDrag', data, geometry, offset)

        const startT = tableStartTime + offset
        const endT =
          tableStartTime +
          offset +
          (width / config.widthTimeX) * config.widthTime

        setTimeStr(formatTime(startT) + '-' + formatTime(endT))
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
            config.onClick(event, props.rowNum, props.eventIndex)
          }
        } else {
          // handle time change

          const delta = (deltaX / config.widthTimeX) * config.widthTime

          const startT =
            startTime + (deltaX / config.widthTimeX) * config.widthTime

          const endT = endTime + (deltaX / config.widthTimeX) * config.widthTime

          // setX(data.lastX)   // geometry updates should handle this

          setStartTime(startT)
          setEndTime(endT)

          event.start = formatTime(startT)
          event.end = formatTime(endT)

          console.log(
            event.start,
            startT,
            startTime,
            formatTime(startTime),
            delta
          )

          // handle row switching
          let origTopY = 0

          for (let i = 0; i < event.row; i++) {
            origTopY += computed.rowHeights[i]
            console.log(origTopY)
          }

          const newTopY = origTopY + data.lastY

          let newRow = 0

          let currentY = computed.rowHeights[newRow]

          while (currentY <= newTopY) {
            newRow += 1
            currentY += computed.rowHeights[newRow]
          }

          event.row = newRow

          // setY(geometry.y)

          updateEvent(props.eventIndex, event)

          // setY(geometries[props.eventIndex].y)
          // setY(0)

          console.log(
            newTopY,
            geometry.y,
            geometry,
            geometries[props.eventIndex].y
            // y
          )
        }

        console.log('onDragStop completed')
      }}
      onResize={(e, dir, ref, delta, pos) => {
        // if (config.resizable) {
        console.log('onResize', dir, delta, pos)

        const deltaTime = (delta.width / config.widthTimeX) * config.widthTime

        let endT = endTime
        let startT = startTime

        if (dir === 'right') {
          endT += deltaTime
        } else {
          startT -= deltaTime
        }

        setTimeStr(formatTime(startT) + '-' + formatTime(endT))
        // }
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        const deltaTime = (delta.width / config.widthTimeX) * config.widthTime

        console.log('onResizeStop', dir, delta, pos, deltaTime)

        if (dir === 'right') {
          setWidth(width + delta.width)
          setEndTime(endTime + deltaTime)
          event.end = formatTime(endTime + deltaTime)
        } else {
          setWidth(width + delta.width)
          setStartTime(startTime - deltaTime)
          // setX(pos.x)
          event.start = formatTime(startTime - deltaTime)
        }

        // TODO: update geometries in case there is an overlap?

        updateEvent(props.eventIndex, event)
      }}
    >
      <div
        className={`sc_bar ${event.data.class}`}
        style={{
          width: '100%',
          height: config.timeLineY + 'px',
        }}
      >
        <span className="head">
          <span className="time">{timeStr}</span>
        </span>
        <span className="text">{event.text}</span>
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

  const geometries = useStore(store, (state) => state.computed.geometries)

  const blankCells = []

  const config = useStore(store, (state) => state.config)

  const cellsWide = useStore(store, (state) => state.computed.cellsWide)
  const rowHeights = useStore(store, (state) => state.computed.rowHeights)

  console.log('row', props.rowNum)

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
        <div style={{ padding: '0 0 40px' }}>
          <div id="schedule" className="jq-schedule">
            <Main />
          </div>
        </div>
      </div>
    </>
  )
}

export default Scheduler
