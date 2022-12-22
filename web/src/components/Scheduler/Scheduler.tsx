import React, { useState } from 'react'

// import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Rnd } from 'react-rnd'
// import { useStore } from 'zustand'

import { formatTime, calcStringTime } from './helpers'
// import SchedulerStore from './scheduleStore'
import { zStore, generateEvent, _generateEvent, getTimeSlots, updateGeometries } from './zstore'

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
      dragGrid={[config.widthTimeX, config.timeLineY + config.timeLineBorder]}
      resizeGrid={[config.widthTimeX, 1]}
      onDrag={(e, data) => {
        console.log('onDrag', data)
        const delta = (data.deltaX / config.widthTimeX) * config.widthTime
        setStartTime(startTime + delta)
        setEndTime(endTime + delta)
      }}
      onDragStop={(e, data)=>{
        console.log('onDragStop', data)
        // TODO: update geometries
        // updateGeometries()
      }}
      onResize={(e, dir, ref, delta, pos) => {
        console.log('onResize', dir, delta, pos)

        const deltaTime = (delta.width / config.widthTimeX) * config.widthTime

        if (dir === 'right') {
          // resize only
          setResizeRight(deltaTime)
        } else {
          // resize and move x ?
          setResizeLeft(deltaTime * -1)
          // setEndTime(endTime + deltaTime)
        }
      }}
      onResizeStop={(e, dir, ref, delta, pos)=>{
        console.log('onResizeStop', dir, delta, pos)
        // TODO: update geometries
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
  const addEvent = zStore((state) => state.addEvent)

  const rows = zStore.getState().rows
  // const rows = zStore((state) => state.rows)
  const tableEndTime = zStore((state) => state.tableEndTime)

  for (let i = 0; i < cellsWide; i++) {
    const time = tableStartTime + i * config.widthTimeX

    blankCells.push(
      <div
        className="tl"
        style={{ width: config.widthTimeX + 'px' }}
        key={i}
        onClick={() => {
          // // const rows = zStore.getState().rows
          // // const rows = zStore((state) => state.rows)
          // // const tableStartTime = zStore((state) => state.tableStartTime)
          // // const tableEndTime = zStore((state) => state.tableEndTime)
          // // const config = zStore((state) => state.config)

          // const times = getTimeSlots(
          //   tableStartTime,
          //   tableEndTime,
          //   config.widthTime
          // )

          // const randEvent = _generateEvent(times, rows.length)

          const randEvent = generateEvent()
          // myStore.addEvent(randEvent)
          addEvent(randEvent)
          // if (config.onScheduleClick) {
          //   config.onScheduleClick(time, i, props.rowNum)
          // }
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

export default observer(Scheduler)
