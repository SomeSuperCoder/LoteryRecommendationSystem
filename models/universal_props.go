package models

type UniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost int
}

type NormalizedUniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost float64
}
