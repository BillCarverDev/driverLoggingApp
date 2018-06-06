$(document).ready(function() {

    let userID = sessionStorage.getItem('userID');
    let username = sessionStorage.getItem('username')
    console.log('userID: ', userID);
    console.log('username: ', username)

    // $().removeAttr("tabindex");

    // Container holding all trips
    let container = $("#recent-trip-data");

    let trips;

    let startingOdo;
    let endingOdo;
    let tripId;
    let tripTips;
    let tripMiles;
    let tripHours;
    let tripHourlyWage;
    let tripDescription;

    $('.shiftStart').attr('style', 'display: block;');
    $('.shiftEnd').attr('style', 'display: none;');

    $("#shiftstart").on("click", function(e) {
        e.preventDefault();
        console.log('Shift started')
        $('.shiftStart').attr('style', 'display: none;');
        $('.shiftEnd').attr('style', 'display: block;');

        startingOdo = $("#starting").val().trim();

        if (startingOdo.length < 1) {
            alert("Please enter Starting Mileage.");
        } 

        console.log("Starting Odometer Miles: " + startingOdo);
        $("#starting").val("");
    })

    $("#shiftend").on("click", function(e) {
        e.preventDefault();
        console.log('Shift ended')
        $('.shiftStart').attr('style', 'display: block;');
        $('.shiftEnd').attr('style', 'display: none;');

        endingOdo = $("#ending").val().trim();
        tripTips = $("#tips").val().trim();
        tripHours = $("#hours").val().trim();
        tripDescription = $("#description").val().trim();

        console.log("Ending Odometer Miles: " + endingOdo);


        $("#ending").val("");
        $("#tips").val("");
        $("#hours").val("");
        $("#description").val("");


        tripMiles = Math.abs(startingOdo - endingOdo);
        tripHourlyWage = Math.abs(tripTips / tripHours);

        console.log("Miles this trip: " + tripMiles);
        console.log("Tips Collected: $" + tripTips);
        console.log("Hours Worked: " + tripHours);
        console.log("Hourly Wage: $" + tripHourlyWage);
        console.log("Description: " + tripDescription);


        let newTrip = {
            user: username,
            userid: userID,
            startingOdometer: startingOdo,
            endingOdometer: endingOdo,
            miles: tripMiles,
            tips: tripTips,
            hours: tripHours,
            wage: tripHourlyWage,
            description: tripDescription
        }
        submitTrip(newTrip);
    })

    function submitTrip(newTrip) {
        $.post("/api/trips", newTrip, function() {
            location.reload();
        })
    }

    // Get trips from database and updates view
    function getTrips() {
        $.get(`/api/${userID}/trips`, function(data) {
            console.log("trips", data);
            trips = data;

            if (!trips || !trips.length) {
                emptyTable();
            } else {
                mostRecent();
            }
            fillTable();
        });
    }

    // Most recent trip table
    function mostRecent() {
        let tripsToAdd = [];
        for (let i = 0; i < trips.length; i++) {
            tripsToAdd.push(trips[i]);
        }

        for (let j = 0; j < tripsToAdd.length; j++) {

            // let tripUser = tripsToAdd[j].user;
            let tripStartingOdo = tripsToAdd[j].startingOdometer
            let tripEndingOdo = tripsToAdd[j].endingOdometer
            let tripMiles = tripsToAdd[j].miles;
            let tripTips = tripsToAdd[j].tips;
            let tripHours = tripsToAdd[j].hours;
            let tripHourlyWage = tripsToAdd[j].wage;
            let tripDescription = tripsToAdd[j].description;


            $("#new-trip-table > tbody").html("<tr><td>" + tripStartingOdo +
                "</td><td>" + tripEndingOdo + "</td><td>" + tripMiles + "</td><td>" + tripTips +
                "</td><td>" + tripHours + "</td><td>" + tripHourlyWage + "</td></tr>");
        };
    };

    // Fill all trips from database into trips Table
    function fillTable() {
        let tripsToAdd = [];
        for (let i = 0; i < trips.length; i++) {
            tripsToAdd.push(trips[i]);
        }

        for (let j = 0; j < tripsToAdd.length; j++) {

            // let tripUser = tripsToAdd[j].user;
            let tripStartingOdo = tripsToAdd[j].startingOdometer
            let tripEndingOdo = tripsToAdd[j].endingOdometer
            let tripMiles = tripsToAdd[j].miles;
            let tripTips = tripsToAdd[j].tips;
            let tripHours = tripsToAdd[j].hours;
            let tripHourlyWage = tripsToAdd[j].wage;
            let tripDescription = tripsToAdd[j].description;
            tripId = tripsToAdd[j].id;

            let editBtn = $("<button>").addClass('btn modal-trigger edit').text('EDIT');
            editBtn.attr("data-target", "modal1");
            editBtn.attr("id", tripId);
            let btnDelete = $('<button>').addClass('btn btn-danger delete').text('X');

            let newRow = $('<tr>');

            $("#all-trips-table > tbody").append(newRow)

            newRow.append('<td>' + tripStartingOdo + '</td>');
            newRow.append('<td>' + tripEndingOdo + '</td>');
            newRow.append('<td>' + tripMiles + '</td>');
            newRow.append('<td>' + tripTips + '</td>');
            newRow.append('<td>' + tripHours + '</td>');
            newRow.append('<td>' + tripHourlyWage + '</td>');
            newRow.append('<td>').find('td').last().append(btnDelete);
            newRow.append('<td>').find('td').last().append(editBtn);

        };
    };

    let hide = true;

    $("#btnAllTrips").click(function() {
        if (hide === true) {
            console.log('show table')
            $('#all-trips-data').attr('style', 'display: table');
            $('#btnAllTrips').html('Hide All Trips <i class="material-icons left">directions_car</i>');
            hide = false;
        } else if (hide === false) {
            console.log('hide table')
            $('#all-trips-data').attr('style', 'display: none');
            $('#btnAllTrips').html('Show All Trips <i class="material-icons left">directions_car</i>');
            hide = true;
        }
    });

    // Display message when no trips have been entered into the database
    function emptyTable() {
        container.empty();
        let messageH2 = $("<h2>");
        messageH2.addClass("message");
        messageH2.css({
            "text-align": "center",
            "margin-top": "50px",
            "color": "white"
        });
        messageH2.html("No recent trip has been entered");
        container.append(messageH2);
    }

    // Form validation
    function validate_form() {
        valid = true;
        if (`${trip_form.starting}` === "") {
            alert("Please fill out Starting Odometer.");
            valid = false;
        }
        return valid;
    }

    // Delete a trip

    $('body').on("click", ".delete", function() {
        console.log("delete Clicked");
        event.stopPropagation();
        var id = $(this).data("id");
        $.delete({
                url: "/api/trips/" + id
            })
            .then(fillTable);
    })


    getTrips();

    // Edit a trip
    function tripEdit() {
        console.log("Editing trip...");
        var id = $(this).attr('id');
        
        $.get(`/api/${userID}/trips/` + id, function(data) {
            console.log(data);
            if (data) {
                let editStarting = $("#editStarting").val(data.startingOdometer);
                let editEnding = $("#editEnding").val(data.endingOdometer);
                let editHours = $("#editHours").val(data.hours);
                let editTips = $("#editTips").val(data.tips);
                let editMiles = $("#editMiles").val(data.miles);
                let editDescription = $("#editDescription").val(data.description);
            }
        })
    }
    // Initialize Materialize JS for Modal
    M.AutoInit();
    // Click Event
    $(document).on("click", ".edit", tripEdit);
    $("#editSubmit").on("click", function(e) {
        e.preventDefault();

        let editStarting = $("#editStarting").val();
        let editEnding = $("#editEnding").val();
        let editHours = $("#editHours").val();
        let editTips = $("#editTips").val();
        let editDescription = $("#editDescription").val();

        console.log("New Starting Odometer: " + editStarting);
        console.log("New Ending Odometer: " + editEnding);
        console.log("New Hours: " + editHours);
        console.log("New Tips: " + editTips);
        console.log("New Description: " + editDescription);

        newTripMiles = Math.abs(editStarting - editEnding);
        newTripHourlyWage = Math.abs(editTips / editHours);

        let editTrip = {
            user: username,
            userid: userID,
            id: tripId,
            startingOdometer: editStarting,
            endingOdometer: editEnding,
            miles: newTripMiles,
            tips: editTips,
            hours: editHours,
            wage: newTripHourlyWage,
            description: editDescription
        }

        updateTrip(editTrip);
    })

    function updateTrip(trip) {
        $.ajax({
            method: "PUT",
            url: `/api/${userID}/trips/${tripId}`,
            data: trip
        })
        .then(function() {
            // location.reload();
        });
    }



});
