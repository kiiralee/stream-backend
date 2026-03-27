const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24 
const w = d * 7
const y = d * 365.25

type Unit = 
    | 'Years'
    | 'Year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Weeks'
    | 'Week'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'