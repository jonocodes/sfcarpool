const FacebookRedirectPage = () => {
  React.useEffect(() => {
    window.location.replace('https://www.facebook.com/groups/bringbacksfcarpool')
  }, [])

  return <h5>Redirecting to Facebook Page...</h5>;
}


export default FacebookRedirectPage
