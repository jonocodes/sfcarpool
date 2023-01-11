import React, { useContext, useState } from 'react'

import { Rnd } from 'react-rnd'
import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'
import { useStore } from 'zustand'

import { useMutation } from '@redwoodjs/web'

import { formatTime, calcStringTime, eventToGql } from './helpers'
import { SchedulerContext } from './zstore'
import { _generateEvent } from './zstore'

function formatTimeSpan(start: number, end: number) {
  return formatTime(start) + '-' + formatTime(end)
}

const icons = {
  passenger: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-person-fill"
      viewBox="0 0 16 16"
    >
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  ),
  driver: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-car-front-fill"
      viewBox="0 0 16 16"
    >
      <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
    </svg>
  ),
}

const Event = (props) => {
  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  const config = useStore(store, (state) => state.config)
  const updateEvent = useStore(store, (state) => state.updateEvent)

  const geometries = useStore(store, (state) => state.computed.geometries)
  const events = useStore(store, (state) => state.events)
  const computed = useStore(store, (state) => state.computed)

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
    formatTimeSpan(
      calcStringTime(events[props.eventIndex].start),
      calcStringTime(events[props.eventIndex].end)
    )
  )

  const tableStartTime = calcStringTime(config.startTime)

  // const UPDATE_EVENT = gql`
  //   mutation UpdateEventMutation($id: Int!, $input: UpdateEventInput!) {
  //     updateEvent(id: $id, input: $input) {
  //       id
  //     }
  //   }
  // `

  // const [update, { loading, error }] = useMutation<
  //   UpdateEventMutation,
  //   UpdateEventMutationVariables
  // >(UPDATE_EVENT, {
  //   // onCompleted: (a) => {
  //   //   console.log(a)
  //   //   toast.success('Thank you for your submission!')
  //   // },
  // })

  // TODO: set this dynamically, and in a single place
  // const startDateStr = '2023-01-09'
  // const startDate = new Date(startDateStr)

  console.log(
    'Event',
    props,
    events[props.eventIndex],
    props.event.end,
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

        console.log('onDragStop', e, data, data.lastX, data.lastY)

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

          // TODO: move gql to zstore ?
          // const gql_data = eventToGql(events[props.eventIndex], startDate)

          // const resp = update({
          //   variables: {
          //     id: Number(events[props.eventIndex].data.entry),
          //     input: gql_data,
          //   },
          // }) //then.error Error saving event

          if (config.onChange) {
            config.onChange(events[props.eventIndex], props.eventIndex)
          }

          updateEvent(props.eventIndex, events[props.eventIndex])
        }

        console.log('onDragStop completed')
      }}
      onResizeStart={(e, dir, ref) => {
        console.log('onResizeStart', dir, ref)
      }}
      onResize={(e, dir, ref, delta, pos) => {
        console.log('onResize', dir, delta, pos, ref)

        // using ref width to workaround https://github.com/bokuweb/react-rnd/issues/901

        const widthTime =
          (ref.offsetWidth / config.widthTimeX) * config.widthTime

        if (dir === 'right') {
          events[props.eventIndex].end = formatTime(
            calcStringTime(events[props.eventIndex].start) + widthTime
          )
        } else {
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
        // const deltaTime = (delta.width / config.widthTimeX) * config.widthTime

        console.log('onResizeStop', dir, delta, pos)

        // TODO: move gql to zstore ? or perhaps Week.tsx
        // const gql_data = eventToGql(events[props.eventIndex], startDate)

        // const resp = update({
        //   variables: {
        //     id: Number(events[props.eventIndex].data.entry),
        //     input: gql_data,
        //   },
        // }) //then.error Error saving event

        if (config.onChange) {
          config.onChange(events[props.eventIndex], props.eventIndex)
        }

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

        <span className="text">
          {icons[events[props.eventIndex].data.mode]}
          {events[props.eventIndex].text}
        </span>
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

  const blankCells = []

  const config = useStore(store, (state) => state.config)

  const cellsWide = useStore(store, (state) => state.computed.cellsWide)
  const rowHeights = useStore(store, (state) => state.computed.rowHeights)

  for (let i = 0; i < cellsWide; i++) {
    blankCells.push(
      <div
        className="tl"
        style={{ width: config.widthTimeX + 'px' }}
        key={i}
        onClick={() => {
          if (config.onScheduleClick) {
            config.onScheduleClick(i, props.rowNum)
          }
        }}
        role="presentation"
      ></div>
    )
  }

  const events = useStore(store, (state) => state.events)

  const eventBlocks = []
  for (let i = 0; i < items_map.length; i++) {
    const eventIndex = items_map[i]
    eventBlocks.push(
      <Event
        event={events[eventIndex]}
        eventIndex={eventIndex}
        key={eventIndex}
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
      <div className="sc_main_box">
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
