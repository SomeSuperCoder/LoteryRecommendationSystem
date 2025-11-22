package models

type UniversalPropsWithK struct {
	UniversalProps
	WinRateK    float64 `json:"win_rate_k"`
	WinSizeK    float64 `json:"win_size_k"`
	FrequencyK  float64 `json:"frequency_k"`
	TicketCostK float64 `json:"ticket_cost_k"`
}

type UniversalProps struct {
	WinRate    float64 `json:"win_rate"`
	WinSize    float64 `json:"win_size"`
	Frequency  float64 `json:"frequency"`
	TicketCost float64 `json:"ticket_cost"`
}

type DiffedUniversalProps struct {
	WinRate    float64 `json:"win_rate"`
	WinSize    float64 `json:"win_size"`
	Frequency  float64 `json:"frequency"`
	TicketCost float64 `json:"ticket_cost"`
}

type UniversalPropsWithCalcualtedDiff struct {
	Diff           float64        `json:"diff"`
	UniversalProps UniversalProps `json:"universal_props"`
}
