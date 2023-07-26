const SurveyRedirectPage = () => {
  React.useEffect(() => {
    window.location.replace('https://docs.google.com/forms/d/e/1FAIpQLSeM-C8f8YoWdCClkFBg686T8rGmqXSoHbJTOWOsfgM7hbfSWg/viewform?usp=sf_link')
  }, [])

  return <h5>Redirecting to survey...</h5>;
}


export default SurveyRedirectPage
