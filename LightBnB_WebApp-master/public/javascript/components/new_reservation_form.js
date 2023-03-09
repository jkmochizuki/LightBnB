$(() => {

  const $newReservationForm = $(`
  <form action="/api/properties" method="post" id="new-reservation-form" class="new-reservation-form">
      <div class="reservation-form__field-wrapper">
        <label for="reservation-form__start-date">Start Date</label>
        <input type="date" name="start-date" id="reservation-form__start-date>
      </div>

      <div class="reservation-form__field-wrapper">
        <label for="reservation-form__end-date">End Date</label>
        <input type="date" name="end-date" id="reservation-form__start-date>
      </div>

        <div class="new-reservation-form__field-wrapper">
            <button>Submit</button>
            <a id="new-reservation-form__cancel" href="#">Cancel</a>
        </div>
        
    </form>
  `);

  window.$newReservationForm = $newReservationForm;

  $newReservationForm.on('submit', function (event) {
    event.preventDefault();

    views_manager.show('none');

    const data = $(this).serialize();
    submitReservation(data)
    .then(() => {
      views_manager.show('listings');
    })
    .catch((error) => {
      console.error(error);
      views_manager.show('listings');
    })
  });
  
  $('body').on('click', '#new-reservation-form__cancel', function() {
    views_manager.show('listings');
    return false;
  });
  
});