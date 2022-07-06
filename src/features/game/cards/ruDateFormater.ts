// Russian
function numpf(n: any, f: any, s: any, t: any) {
    // f - 1, 21, 31, ...
    // s - 2-4, 22-24, 32-34 ...
    // t - 5-20, 25-30, ...
    var n10 = n % 10;

    if (n10 === 1 && (n === 1 || n > 20)) {
        return f;
    } else if (n10 > 1 && n10 < 5 && (n > 20 || n < 10)) {
        return s;
    } else {
        return t;
    }
}

var strings = {
    prefixAgo: null,
    prefixFromNow: 'через',
    suffixAgo: function suffixAgo(value: any) {
        if (value === 0)
            return ''
        return 'назад'
    },
    suffixFromNow: null,
    seconds: function seconds(value: any) {
        if (value === 0)
            return 'ПРЯМО СЕЙЧАС'
        return `меньше минуты`
    },
    minute: 'минуту',
    minutes: function minutes(value: any) {
        return numpf(value, '%d минута', '%d минуты', '%d минут');
    },
    hour: 'час',
    hours: function hours(value: any) {
        return numpf(value, '%d час', '%d часа', '%d часов');
    },
    day: 'день',
    days: function days(value: any) {
        return numpf(value, '%d день', '%d дня', '%d дней');
    },
    month: 'месяц',
    months: function months(value: any) {
        return numpf(value, '%d месяц', '%d месяца', '%d месяцев');
    },
    year: 'год',
    years: function years(value: any) {
        return numpf(value, '%d год', '%d года', '%d лет');
    }
};
const ruDateFormater = strings;
export default ruDateFormater