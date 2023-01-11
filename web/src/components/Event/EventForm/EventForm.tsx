import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  CheckboxField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

import type { EditEventById, UpdateEventInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormEvent = NonNullable<EditEventById['event']>

interface EventFormProps {
  event?: EditEventById['event']
  onSave: (data: UpdateEventInput, id?: FormEvent['id']) => void
  error: RWGqlError
  loading: boolean
}

const EventForm = (props: EventFormProps) => {
  const onSubmit = (data: FormEvent) => {

























    props.onSave(data, props?.event?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormEvent> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="label"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Label
        </Label>

          <TextField
            name="label"
            defaultValue={props.event?.label}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="label" className="rw-field-error" />

        <Label
          name="date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date
        </Label>

          <DatetimeLocalField
            name="date"
            defaultValue={formatDatetime(props.event?.date)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="date" className="rw-field-error" />

        <Label
          name="start"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start
        </Label>

          <DatetimeLocalField
            name="start"
            defaultValue={formatDatetime(props.event?.start)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="start" className="rw-field-error" />

        <Label
          name="end"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End
        </Label>

          <DatetimeLocalField
            name="end"
            defaultValue={formatDatetime(props.event?.end)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="end" className="rw-field-error" />

        <Label
          name="passenger"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Passenger
        </Label>

          <CheckboxField
            name="passenger"
            defaultChecked={props.event?.passenger}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="passenger" className="rw-field-error" />

        <Label
          name="likelihood"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          likelihood
        </Label>

          <NumberField
            name="likelihood"
            defaultValue={props.event?.likelihood}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="likelihood" className="rw-field-error" />

        <Label
          name="active"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Active
        </Label>

          <CheckboxField
            name="active"
            defaultChecked={props.event?.active}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="active" className="rw-field-error" />

        <Label
          name="locationId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Location id
        </Label>

          <NumberField
            name="locationId"
            defaultValue={props.event?.locationId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="locationId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default EventForm
