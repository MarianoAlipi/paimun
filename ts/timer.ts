// Modifed from: https://stackoverflow.com/questions/3969475/javascript-pause-settimeout

/** Wrapper for setTimeout */
class Timer {
    private _start: Date;
    private _remaining: number;
    private _durationTimeoutId?: number;
    private _intervalTimeoutId?: number;
    private _interval?: number;
    private _intervalCallback?: (...args: any[]) => void;
    private _doneCallback: (...args: any[]) => void;

    constructor(doneCallback: (...args: any[]) => void, ms = 0, interval?: number, intervalCallback?: (...args: any[]) => void) {
        this._doneCallback = () => {
            doneCallback();
        };

        if (interval && intervalCallback) {
            this.setInterval(interval, intervalCallback);
        }

        this._remaining = ms;
    }

    /** starts the timer */
    start(): Timer {
        if (!this._durationTimeoutId) {
            this._start = new Date;
            this._durationTimeoutId = setTimeout(this._doneCallback, this._remaining);
            if (this._interval && this._intervalCallback) {
                this._intervalTimeoutId = setInterval(this._intervalCallback, this._interval);
            }
        }
        return this;
    }

    /** stops the timer */
    stop(): Timer {
        if (this._durationTimeoutId) {
            clearTimeout(this._durationTimeoutId);
            this._remaining -= new Date().valueOf() - this._start.valueOf();
            this._durationTimeoutId = undefined;
        }

        if (this._intervalTimeoutId) {
            clearInterval(this._intervalTimeoutId);
            this._intervalTimeoutId = undefined;
        }
        return this;
    }

    /** clears the timeout */
    clearTimeout() {
        this._clearTimeoutRef();
    }

    private _clearTimeoutRef() {
        if (this._durationTimeoutId) {
            clearTimeout(this._durationTimeoutId);
            this._durationTimeoutId = undefined;
        }

        if (this._intervalTimeoutId) {
            clearInterval(this._intervalTimeoutId);
            console.log('cleared interval');
            this._intervalTimeoutId = undefined;
        }
    }

    /** sets the interval and interval callback */
    setInterval(interval: number, callback: (...args: any[]) => void): Timer {
        this._interval = interval;
        this._intervalCallback = callback;
        return this;
    }
}

const intervalCallback = () => {
    if (currSecs === 0) {
        currMins--;
        currSecs = 59;
    } else {
        currSecs--;
    }
    timerDisplay.textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;
};

const doneCallback = () => {
    isRunning = false;
    timerDisplay.textContent = '0:00';
    startStopButton.textContent = 'Start';
    startStopButton.classList.add('btn-primary');
    startStopButton.classList.remove('btn-danger');
    startStopButton.disabled = true;
    resetButton.disabled = false;
    myTimer.stop();
    myTimer = null;
};

// The time set in the agenda
let agendaMins = 0, agendaSecs = 5;
// The current time (the time that is displayed)
let currMins = agendaMins, currSecs = agendaSecs;
let isRunning = false;

const timerDisplay = document.getElementById('timer-text') as HTMLSpanElement;
const startStopButton = document.getElementById('start-stop-timer-btn') as HTMLButtonElement;
const resetButton = document.getElementById('reset-timer-btn') as HTMLButtonElement;

timerDisplay.textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;

// Create a timer with the minutes and seconds passed.
// The timer won't start until the start method is called.
const createTimer = (mins: number, secs: number): Timer => {
    const totalMs = (mins * 60 + secs) * 1000;
    return new Timer(
        doneCallback,
        totalMs,
        1000,
        intervalCallback
    );
}

// Start/stop button
startStopButton.addEventListener('click', () => {
    if (isRunning) {
        // When stopping the timer, clear the timeout and destroy the timer object
        myTimer.stop();
        myTimer = null;
        isRunning = false;

        startStopButton.textContent = 'Start';
        startStopButton.classList.add('btn-primary');
        startStopButton.classList.remove('btn-danger');
        resetButton.disabled = false;
    } else {
        // When starting the timer, create a new timer with the current minutes and seconds
        myTimer = createTimer(currMins, currSecs);
        myTimer.start();
        isRunning = true;

        startStopButton.textContent = 'Stop';
        startStopButton.classList.add('btn-danger');
        startStopButton.classList.remove('btn-primary');
        resetButton.disabled = true;
    }
});

// Reset button
resetButton.addEventListener('click', () => {
    currMins = agendaMins;
    currSecs = agendaSecs;
    myTimer = new Timer(
        doneCallback,
        currSecs * 1000,
        1000,
        intervalCallback
    );
    
    timerDisplay.textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;
    startStopButton.textContent = 'Start';
    resetButton.disabled = true;
    startStopButton.disabled = false;
});

let myTimer = createTimer(currMins, currSecs);
