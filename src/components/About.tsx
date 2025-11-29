import { Container } from "react-bootstrap";
// import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const About: React.FC = () => {
  return (
    <Container>
      <div className="about">
        <h2>About</h2>
        <p>
          The pandemic has brought SF casual carpool to a halt. This site is an effort to get it up
          an running again.
        </p>
        <p>
          There is no official site for Casual Carpool, but for general info about how Casual
          Carpool works these links may be helpful{" "}
          <a href="https://www.ridenow.org/carpool">Ridenow</a>,{" "}
          <a href="https://sfcasualcarpool.com/how_it_works#!">SF Casual Carpool</a>,{" "}
          <a href="https://511.org/carpool/casual">511.org</a>,{" "}
          <a href="https://www.berkeleyside.org/2022/11/20/casual-carpool-bay-bridge-covid-traffi">
            Article about the pandemic's affect on Casual Carpool
          </a>
          .
        </p>
        <p>
          If you would like to help contribute or discuss solutions for casual carpool please take{" "}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeM-C8f8YoWdCClkFBg686T8rGmqXSoHbJTOWOsfgM7hbfSWg/viewform?usp=sf_link">
            this survey
          </a>{" "}
          and join the facebook group{" "}
          <a href="https://www.facebook.com/groups/bringbacksfcarpool">
            Let's Bring Back SF Bay Area Casual Carpool.
          </a>
        </p>
        <h2>FAQ</h2>
        <h3>Why did you make this?</h3>
        <p>
          The longer we wait to get the carpool running again, the less likely it will come back as
          people move away, retire, and become comfortable with the isolation brought upon by the
          pandemic. We can bring it back, but it requires a critical mass of both drivers and
          passengers.
        </p>
        <p>
          I made this site in December 2022 after a few months of trying various methods to stir up
          interest at North Berkeley BART, with little success. I managed to get picked up several
          times by one other enthusiastic driver. I figured the two of us could start coordinating
          over text and still meet at the line to give visibility to the cause. And then I thought
          if we make that communication public others could easily join as well and help it grow.
        </p>
        <h3>Is this really still &quot;casual&quot;?</h3>
        <p>
          Hopefully this is a short term solution to get back to where we were a few years back.
          Then we wont need to coordinate, and can just go to the line at the curb - as we did
          before the days of the internet.
        </p>
        <h3>This look like a website. Is there an app I could use instead?</h3>
        <p>
          You can use this as an "app" that lives in your phone's home screen by going to the home
          page and then{" "}
          <a href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/">
            following these instructions
          </a>
          .
        </p>
        <h3>Why not use an already existing carpool app instead of making this site?</h3>
        <p>
          There are several good resources for coordinating carpools, but I have not found one that
          fits the needs of casual carpool. Tools like <a href="https://merge.511.org/">Merge</a>{" "}
          are for coordinating one-to-one with neighbors for ongoing carpool arrangements. While
          that does help make carpools happen, it will not bring back the line outside BART that
          anyone can just walk up to.
        </p>
        <h3>I'm available the same time every week. Can I add a time slot that repeats?</h3>
        <p>Not yet. Maybe in the future.</p>
        <h3>Can I use this site to start a casual carpool in my town?</h3>
        <p>
          This site is <a href="https://github.com/jonocodes/sfcarpool/tree/hasura">open source</a>,
          so you can host a copy of it and make it fit your needs.
        </p>
        <h3>Have you considered trying X instead of this?</h3>
        This website is only one of{" "}
        <a href="https://digitus.notion.site/San-Francisco-Casual-Carpool-0f62a4e23df14e159c845ec6b73884b3?pvs=4">
          the many things I (Jono) have tried.
        </a>
        <h3>What if I have complaints/suggestions/questions?</h3>
        <p>
          Please contact <a href="mailto:carpool@zop.anonaddy.com">Jono</a>.
        </p>
      </div>
    </Container>
  );
};
