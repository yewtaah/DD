document.addEventListener('DOMContentLoaded', () => {
    // Set to the next tournament's start date/time once it's scheduled, e.g. 'May 2 2026 10:00:00 GMT-0600'.
    // Leave blank while no date has been picked yet - the clock will show a TBD message instead of counting negative.
    const deadline = '';

    initializeClock('clockdiv', deadline);

    function getTimeRemaining(endtime){
        const total = Date.parse(endtime) - Date.parse(new Date());
        const seconds = pad(Math.floor( (total/1000) % 60 ), 2);
        const minutes = pad(Math.floor( (total/1000/60) % 60 ), 2);
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
        if (!clock) return;

        if (!endtime || isNaN(Date.parse(endtime))) {
          clock.innerHTML = 'Next tournament: date TBD';
          return;
        }

        const timeinterval = setInterval(() => {
          const t = getTimeRemaining(endtime);
          if (t.total <= 0) {
            clock.innerHTML = 'Next tournament: date TBD';
            clearInterval(timeinterval);
            return;
          }
          clock.innerHTML = 'Countdown Timer:<br>' +
                            'days: ' + t.days + ' <br>' +
                            'hours: '+ t.hours + ':' + t.minutes + ':' + t.seconds;
        },1000);
      }

      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
})
