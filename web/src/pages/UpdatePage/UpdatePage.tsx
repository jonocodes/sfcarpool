import { MetaTags } from '@redwoodjs/web'

const UpdatePage = () => {
  return (
    <>
      <MetaTags title="Update" description="Update page" />
      <div>
        <h2>Instructions</h2>
        <p>
          Put you entry approximately where it belongs in its row, and write the
          time in it. A name/label is not required, but is helpful in case you
          want to identify and update your entries. Use the colors shown at the
          top. If there are not enough rows in a day, insert a new one. If your
          location is not represented, duplicate an existing sheet and label it
          accordingly.
        </p>
        <p>
          Note you can not yet specify recurring events. Every weekend the
          calendar will be cleared, so you will need to enter your dates again.
        </p>

        <iframe
          src="https://docs.google.com/spreadsheets/d/1UnyIpRKFSFQhzDy2FdSmHa_euWnWYv9dPP9Nq0h62Gk/edit?usp=sharing"
          height="1200"
          width="900"
          title="Update schedule for the week"
        ></iframe>
      </div>
    </>
  )
}

export default UpdatePage
