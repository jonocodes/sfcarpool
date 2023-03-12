import React from 'react'

export const decorators = [
  (Story) => (
    <div className="light-theme">
      <Story />
    </div>
  ),
]
