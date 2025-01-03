/**
 * Spin the wheel, take a chance.
 */
addEventListener( 'DOMContentLoaded', (e) => {
    const spinButton = document.getElementById('button_spin');
    const pointer    = document.getElementById('spinner_pointer');
    const wheel      = document.getElementById('wheel');
    const result     = document.getElementById('result');
    const resultBox  = document.getElementById('result_box');
    let timer        = null;

    spinButton.addEventListener( 'click', handleSpin );

    function handleSpin(e) {
        const duration      = Math.random() * 5000;
        const spinUp        = Math.random() * 2000;
        const spinDown      = Math.random() * 3000;
        const totalDuration = spinUp + duration + spinDown;
        let position        = pointer.dataset.rotation;
        let time            = 0;
        let timeDown        = Math.round(spinDown);
        const maxSpeed      = 59;
        let currentSpeed    = 0;

        clearInterval(timer);
        timer = setInterval( spin, 25 );

        resultBox.classList.remove('show-results');

        function spin() {
            if ( time >= totalDuration ) {
                position = parseInt(position) % 360;
                pointer.style.transform = 'rotate(' + position + 'deg)';
                pointer.dataset.rotation = position;
                clearInterval( timer );

                // show the results.
                let adjustment = ( 360 / wheel.childElementCount ) * 2;
                let adjustedPosition = position + adjustment;
                if ( ( position + adjustment ) > 360 ) {
                    adjustedPosition = adjustedPosition - 360;
                }

                resultBox.classList.add('show-results');
                result.textContent = "Fuck " + wheel.children[ Math.ceil(adjustedPosition * wheel.childElementCount / 360) - 1 ].textContent + '!';
            }

            time += 25;

            if ( time < spinUp ) {
                // acceleration up to max speed
                currentSpeed = Math.round( maxSpeed * (time / spinUp) );
                position = parseInt(position) + parseInt(currentSpeed);
            } else if ( time >= spinUp && time <= (spinUp + duration) ) {
                // spin freely at max speed
                position = parseInt(position) + maxSpeed;
            } else if ( time > ( spinUp + duration) ) {
                // deceleration
                timeDown -= 25;
                currentSpeed = Math.round( maxSpeed * (timeDown / spinDown ) );
                if ( currentSpeed < 0 ) {
                    currentSpeed = 0;
                }
                position = parseInt(position) + parseInt(currentSpeed);
            }
            pointer.style.transform = 'rotate(' + position + 'deg)';
            pointer.dataset.rotation = position;
        }
    }

});