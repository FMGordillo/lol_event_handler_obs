const data =  {
  assists: 0,
  creepStore: 0,
  deaths: 0,
  kills: 0,
  wardScore: 0,
}
document.body.addEventListener('htmx:afterSwap', function (event) {

  if (event.detail.xhr.responseText === "") {
    return;
  }

  const current = JSON.parse(event.detail.xhr.responseText);

  Object.entries(current).forEach(([key, value]) => {
    if (key === 'deaths' && value > data.deaths) {
      // OPA OPA OPA
      console.log('haha loser');
    }

    data[key] = value
  })

})
