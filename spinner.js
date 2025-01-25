/**
 * Spin the wheel, take a chance.
 */
addEventListener( 'DOMContentLoaded', (e) => {
    const game        = document.getElementById('game');
    const spinButton  = document.getElementById('button_spin');
    const resetButton = document.getElementById('button_reset');
    const helpButton  = document.getElementById('button_help');
    const helpClose   = document.getElementById('button_help_close');
    const pointer     = document.getElementById('spinner_pointer');
    const wheel       = document.getElementById('wheel');
    const result      = document.getElementById('result');
    const resultBox   = document.getElementById('result_box');
    const costText    = document.getElementById('cost_text');
    const surprise    = document.getElementById('surprise_box');
    const score       = document.getElementById('score');
    const helpBox     = document.getElementById('help_box');
    const localFucks  = 'fucks';
    const maxFucks    = 50;
    let timer         = null;
    let ftg           = window.localStorage.getItem( localFucks );

    if ( ! ftg ) {
        window.localStorage.setItem( localFucks, maxFucks);
    }
    if ( ftg < 0 ) {
        console.log( 'Fuck you, dude.' );
        window.localStorage.setItem( localFucks, maxFucks );
    }
    ftg = window.localStorage.getItem( localFucks );
    setScore( ftg );

    // events!
    spinButton.addEventListener( 'click', handleSpin );
    surprise.addEventListener( 'click', clearSurprise );
    resultBox.addEventListener( 'click', handleDismiss );
    resetButton.addEventListener( 'click', handleReset );
    helpButton.addEventListener( 'click', toggleHelp );
    helpClose.addEventListener( 'click', toggleHelp );

    // set game status.
    game.dataset.status = ftg > 0 ? 'playing' : 'over';

    /**
     * Dismiss the standard game result.
     * @param {event} e 
     */
    function handleDismiss(e) {
        resultBox.classList.remove('show-results');
    }

    /**
     * Clear the surprise.
     *
     * @param {event} e 
     */
    function clearSurprise(e) {
        surprise.classList.remove( 'show-surprise' );
        spinButton.removeAttribute( 'disabled' );
    }

    /**
     * Show the surprise.
     */
    function showSurprise() {
        surprise.classList.add('show-surprise');
        game.dataset.status = "over";
        resetButton.removeAttribute('disabled');
    }

    /**
     * Display results
     *
     * @param {array} targetSlice Selected portion of the spinner
     * @param {int} cost 1-5 fucks
     */
    function showResult( targetSlice, cost ) {
        resultBox.classList.add('show-results');
        spinButton.removeAttribute( 'disabled' );
        result.textContent = "Fuck " + targetSlice.textContent + '!';
        costText.textContent = "(You gave " + cost + " fuck" + ( cost > 1 ? "s" : "" ) + ")";
    }

    /**
     * Reset game.
     *
     * @param {event} e 
     */
    function handleReset(e) {
        clearSurprise();
        ftg = maxFucks;
        setScore( ftg );
        window.localStorage.setItem( localFucks, maxFucks);
        pointer.style.transform = 'rotate(0deg)';
        pointer.dataset.rotation = 0;
        game.dataset.status = "playing";
    }

    /**
     * Set score.
     *
     * @param {int} newScore 
     */
    function setScore( newScore ) {
        let scoreText = newScore + ' fucks left to give.';

        if ( parseInt( newScore ) === 1 ) {
            scoreText = 'Down to your last fuck.';
        }

        if ( parseInt( newScore ) <= 0 ) {
            ftg = 0;
            scoreText = 'All out of fucks to give.';
        }
        score.textContent = scoreText;
    }

    /**
     * Hide/show help text.
     * 
     * @param {event} e 
     */
    function toggleHelp(e) {
        helpBox.classList.toggle('open');
    }

    /**
     * Spin.
     *
     * @param {event} e 
     */
    function handleSpin(e) {
        const duration      = 600 + Math.random() * 3200;
        const spinUp        = 300 + Math.random() * 1400;
        const spinDown      = 400 + Math.random() * 1900;
        const totalDuration = spinUp + duration + spinDown;
        const maxSpeed      = 45;

        let position        = pointer.dataset.rotation;
        let time            = 0;
        let timeDown        = Math.round(spinDown);
        let currentSpeed    = 0;

        // error checking, no negatives.
        ftg = window.localStorage.getItem( localFucks );
        if ( ftg < 0 ) {
            console.log( 'Fuck you, dude.' );
            window.localStorage.setItem( localFucks, maxFucks );
            ftg = maxFucks;
            setScore( maxFucks );
        }

        // reset timer, clear results.
        clearInterval(timer);
        timer = setInterval( spin, 25 );
        spinButton.setAttribute( 'disabled', 'disabled' );
        resultBox.classList.remove('show-results');
        helpBox.classList.remove('open');

        /**
         * Spinning wheel, spinning round.
         * 
         * @returns void;
         */
        function spin() {

            // spin done.
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
                let targetSlice = wheel.children[ Math.ceil(adjustedPosition * wheel.childElementCount / 360) - 1 ];

                let cost = parseInt( Math.floor( 1 + ( Math.random() * 5 ) ) );
                ftg -= cost;
                window.localStorage.setItem( localFucks, ftg );
                setScore( ftg );

                // if we're out of fucks, that's all folks.
                if ( 0 === ftg ) {
                    showSurprise();
                    return;
                }

                showResult( targetSlice, cost );
            }

            // advance time.
            time += 25;

            // spin up, spin, spin down.
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