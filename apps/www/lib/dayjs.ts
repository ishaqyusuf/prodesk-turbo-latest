import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import updateLocale from "dayjs/plugin/updateLocale";

// Import any additional plugins or locales if needed
import "dayjs/locale/en";

// Initialize dayjs with relativeTime plugin
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
    relativeTime: {
        // past: "%s ago",
        future: "in %s",
        past: "%s",
        s: "Now",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "yesterday",
        dd: "%dd ago",
        w: "1w",
        ww: "%dw",
        M: "1m", // month
        MM: "%dm",
        y: "1y",
        yy: "%dy",
    },
});
// Set the default locale
dayjs.locale("en");
export default dayjs;
