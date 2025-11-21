package models

type UniversalPropsWithK struct {
	UniversalProps
	WinRateK, WinSizeK, FrequencyK, TicketCostK float64
}

func (u *UniversalPropsWithK) AsUniversalProps() *UniversalProps {
	return &UniversalProps{
		WinRate:    u.WinRate / u.WinRateK,
		WinSize:    u.WinSize / u.WinSize,
		Frequency:  u.Frequency / u.FrequencyK,
		TicketCost: u.TicketCost / u.TicketCostK,
	}
}

type UniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost float64
}

type DiffedUniversalProps struct {
	WinRate, WinSize, Frequency, TicketCost float64
}

type UniversalPropsWithCalcualtedDiff struct {
	Diff           float64
	UniversalProps UniversalProps
}
