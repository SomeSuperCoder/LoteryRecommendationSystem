package models

type UniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost int
}

type DiffedUniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost float64
}

type UniversalPropsWithCalcualtedDiff struct {
	Diff           float64
	UniversalProps UniversalProps
}
