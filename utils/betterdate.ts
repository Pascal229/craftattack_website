type Format = string



export class BetterDate extends Date {
    /**
         * Converts the value of the current Date object to its equivalent string representation.
         * Format Specifiers
        <pre>
        Format  Description                                                                  Example
        ------  ---------------------------------------------------------------------------  -----------------------
         s      The seconds of the minute between 0-59.                                      "0" to "59"
         ss     The seconds of the minute with leading zero if required.                     "00" to "59"
         
         m      The minute of the hour between 0-59.                                         "0"  or "59"
         mm     The minute of the hour with leading zero if required.                        "00" or "59"
         
         h      The hour of the day between 1-12.                                            "1"  to "12"
         hh     The hour of the day with leading zero if required.                           "01" to "12"
         
         H      The hour of the day between 0-23.                                            "0"  to "23"
         HH     The hour of the day with leading zero if required.                           "00" to "23"
         
         d      The day of the month between 1 and 31.                                       "1"  to "31"
         dd     The day of the month with leading zero if required.                          "01" to "31"
         ddd    Abbreviated day name. $C.abbreviatedDayNames.                                "Mon" to "Sun" 
         dddd   The full day name. $C.dayNames.                                              "Monday" to "Sunday"
         
         M      The month of the year between 1-12.                                          "1" to "12"
         MM     The month of the year with leading zero if required.                         "01" to "12"
         MMM    Abbreviated month name. $C.abbreviatedMonthNames.                            "Jan" to "Dec"
         MMMM   The full month name. $C.monthNames.                                          "January" to "December"
         yy     The year as a two-digit number.                                              "99" or "08"
         yyyy   The full four digit year.                                                    "1999" or "2008"
         
        </pre>
        * @param {String}  format  String that defines the format patterns
        * @return {String}  The formatted date string.
    */
    public format(format: Format) {
        return format ? format.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g,
            (m: any) => {
                if (m.charAt(0) === "\\") {
                    return m.replace("\\", "");
                }

                switch (m) {
                    case "hh":
                        return this.formatDigit(this.getHours() < 13 ? (this.getHours() === 0 ? 12 : this.getHours()) : (this.getHours() - 12));
                    case "h":
                        return this.getHours() < 13 ? (this.getHours() === 0 ? 12 : this.getHours()) : (this.getHours() - 12);
                    case "HH":
                        return this.formatDigit(this.getHours());
                    case "H":
                        return this.getHours();
                    case "mm":
                        return this.formatDigit(this.getMinutes());
                    case "m":
                        return this.getMinutes();
                    case "ss":
                        return this.formatDigit(this.getSeconds());
                    case "s":
                        return this.getSeconds();
                    case "yyyy":
                        return this.formatDigit(this.getFullYear(), 4);
                    case "yy":
                        return this.formatDigit(this.getFullYear());
                    case "dddd":
                        return this.getDayName(this.getDay());
                    case "ddd":
                        return this.getShortDayName(this.getDay());
                    case "dd":
                        return this.formatDigit(this.getDate());
                    case "d":
                        return this.getDate();
                    case "MMMM":
                        return this.getMonthName(this.getMonth());
                    case "MMM":
                        return this.getShortMonthName(this.getMonth());
                    case "MM":
                        return this.formatDigit((this.getMonth() + 1));
                    case "M":
                        return this.getMonth() + 1;
                    default:
                        return m;
                }
            }
        ) : this.toDateString();
    }

    private formatDigit(n: number, length: number = 2) {
        let s = n.toString();
        while (s.length < length) s = "0" + s;
        return s.slice(-length);
    }

    private getDayName(day: number) {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        return days[day];
    }

    private getShortDayName(day: number) {
        const days = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];
        return days[day];
    }

    private getMonthName(month: number) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return months[month];
    }

    private getShortMonthName(month: number) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        return months[month];
    }
}