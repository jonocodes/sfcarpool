import { MetaTags } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <MetaTags title="About" description="About page" />

      <div>
        <h2>About</h2>
        <p>
          The pandemic has brought SF casual carpool to a halt. This site is an
          effort to get it up an running again.
        </p>
        <p>
          For general info about how Casual Carpool works visit{' '}
          <a href="https://www.ridenow.org/carpool">Ridenow</a>.
        </p>

        <h2>FAQ</h2>
        <p>
          {' '}
          <h3>Why did you make this?</h3>
          The longer we wait to get the carpool running again, the less likely
          it will come back as people move away, retire, and become comfortable
          with the isolation brought upon by the pandemic. We can bring it back,
          but it requires a critical mass of both drivers and passengers.
          <br />
          <br />I made this site in December 2022 after a few months of trying
          various methods to stir up interest at North Berkeley BART, with
          little success. I managed to get picked up several times by one other
          enthusiastic driver. I figured the two of us could start coordinating
          over text and still meet at the line to give visibility to the cause.
          And then I thought if we make that communication public others could
          easily join as well and help it grow.
          <h3>Is this really still &quot;casual&quot;?</h3>
          Hopefully it is a short term solution to get back to where we were a
          few years back. Then we wont need to coordinate, and can just go to
          the line at the curb.
          <h3>Is this just a glorified spreadsheet?</h3>
          Yes.
          <h3>Why not use an already existing carpool app?</h3>
          There are several good resources for coordinating carpools, but I have
          not found one that fits the needs of casual carpool. Tools like{' '}
          <a href="https://merge.511.org/">Merge</a> are for coordinating
          one-to-one with neighbors for ongoing carpool arrangements. While that
          does help make carpools happen, it will not bring back the line
          outside BART that anyone can just walk up to.
          <h3>What if I have complaints/suggestions/questions?</h3>
          Please contact <a href="mailto:carpool@zop.anonaddy.com">Jono</a>.
        </p>
      </div>
    </>
  )
}

export default AboutPage
