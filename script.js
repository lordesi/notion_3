class ProgressClock {
    constructor(qs) {
        this.el = document.querySelector(qs);
        this.time = 0;
        this.updateTimeout = null;
        this.ringTimeouts = [];
        this.update();
    }

    getDayOfWeek(day) {
        // Restituisce il giorno della settimana
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[day];
    }

    getMonthInfo(month, year) {
        // Restituisce informazioni sul mese
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthLengths = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return { name: monthNames[month], days: monthLengths[month] };
    }

    update() {
        this.time = new Date();
        const dayOfWeek = this.time.getDay();
        const year = this.time.getFullYear();
        const month = this.time.getMonth();
        const day = this.time.getDate();
        const hour = this.time.getHours();
        const minute = this.time.getMinutes();
        const second = this.time.getSeconds();

        // Ottenimento del giorno della settimana e informazioni sul mese
        const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
        const monthInfo = this.getMonthInfo(month, year);

        // Calcolo dei progressi per i diversi livelli dell'orologio
        const secondsProgress = second / 60;
        const minutesProgress = (minute + secondsProgress) / 60;
        const hoursProgress = (hour + minutesProgress) / 12;
        const daysProgress = (hour + minutesProgress) / 24;
        const monthsProgress = ((day - 1) + daysProgress) / monthInfo.days;

        // Aggiornamento visuale dell'orologio
        this.updateClockDisplay([
            { label: "w", value: dayOfWeekName },
            { label: "mo", value: monthInfo.name, progress: monthsProgress },
            { label: "d", value: day, progress: daysProgress },
            { label: "h", value: hour, progress: hoursProgress },
            { label: "m", value: minute, progress: minutesProgress },
            { label: "s", value: second, progress: secondsProgress },
        ]);

        this.scheduleNextUpdate();
    }

    updateClockDisplay(units) {
        units.forEach(unit => {
            const element = this.el.querySelector(`[data-unit="${unit.label}"]`);
            if (element) {
                element.textContent = unit.value < 10 ? `0${unit.value}` : unit.value;
            }

            const ring = this.el.querySelector(`[data-ring="${unit.label}"]`);
            if (ring) {
                const circumference = 2 * Math.PI * ring.getAttribute("r");
                const strokeDashArray = circumference.toFixed(2);
                const strokeDashOffset = (1 - unit.progress) * circumference;
                ring.style.strokeDasharray = `${strokeDashArray} ${strokeDashArray}`;
                ring.style.strokeDashoffset = `${strokeDashOffset.toFixed(2)}px`;
            }
        });
    }

    scheduleNextUpdate() {
        this.updateTimeout = setTimeout(() => this.update(), 1000);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const clock = new ProgressClock("#clock");
});
