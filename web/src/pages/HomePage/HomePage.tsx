import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <div>
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTv9sKAlOfF1C2hvNV4oO53CvYg95pIjcYsEyDAb5bWwt_Id5ZfJ7xITLxoYZfRNz0dgX2VxNNcsEFJ/pubhtml?widget=true&headers=false&chrome=false&gid=0"
          height="850"
          width="850"
          title="View schedule for the week"
        ></iframe>
      </div>
    </>
  )
}

export default HomePage
