document.addEventListener('DOMContentLoaded', () => {
    const deadline = 'April 16 2021 17:00:00 GMT-0600'
    getTimeRemaining(deadline).minutes
    initializeClock('clockdiv', deadline);

    function getTimeRemaining(endtime){
        const total = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor( (total/1000) % 60 );
        const minutes = Math.floor( (total/1000/60) % 60 );
        const hours = Math.floor( (total/(1000*60*60)) % 24 );
        const days = Math.floor( total/(1000*60*60*24) );
      
        return {
          total,
          days,
          hours,
          minutes,
          seconds
        };
      }

      function initializeClock(id, endtime) {
        const clock = document.getElementById(id);
        const timeinterval = setInterval(() => {
          const t = getTimeRemaining(endtime);
//          clock.innerHTML = 'days: ' + t.days + '<br>' +
//                            'hours: '+ t.hours + '<br>' +
//                            'minutes: ' + t.minutes + '<br>' +
//                            'seconds: ' + t.seconds;
          clock.innerHTML = 'days: ' + t.days + ' <br>' +
                            'hours: '+ t.hours + ':' + t.minutes + ':' + t.seconds;
          if (t.total <= 0) {
            clearInterval(timeinterval);
          }
        },1000);
      }
})