package models

type PlayStyle string

// v
const (
	PlayStyleFrequentSmallWins PlayStyle = "frequent_small_wins"
	PlayStyleRareBigWins       PlayStyle = "rare_big_wins"
	PlayStyleInstantResults    PlayStyle = "instant_results"
	PlayStyleBalanced          PlayStyle = "balanced"
	// PlayStyleUnknown           PlayStyle = "unknown"
)

type PriceRange string

// v
const (
	PriceRangeUnder100 PriceRange = "under_100"
	PriceRange100To200 PriceRange = "100_200"
	PriceRange200To500 PriceRange = "200_500"
	PriceRangeOver500  PriceRange = "over_500"
	// PriceRangeCustom   PriceRange = "custom"
)

type Frequency string

// v
const (
	FrequencyDaily         Frequency = "daily"
	FrequencySeveralWeekly Frequency = "several_weekly"
	FrequencyWeekly        Frequency = "weekly"
	FrequencyMonthly       Frequency = "monthly"
	// FrequencyUnknown       Frequency = "unknown"
)

type Risk string

// v
const (
	RiskHigh     Risk = "high"
	RiskLow      Risk = "low"
	RiskModerate Risk = "moderate"
)

type Simplicity string

// v
const (
	SimplicityImportant    Simplicity = "important"
	SimplicityPreferred    Simplicity = "preferred"
	SimplicityNotImportant Simplicity = "not_important"
)

type Format string

// n
const (
	FormatOnline  Format = "online"
	FormatOffline Format = "offline"
	FormatAny     Format = "any"
)

type Type string

// n
const (
	TypeInstant  Type = "instant"
	TypeDraw     Type = "draw"
	TypeThematic Type = "thematic"
	TypeAny      Type = "any"
)

type Motivation string

const (
	MotivationEntertainment Motivation = "entertainment"
	MotivationBigWin        Motivation = "big_win"
	MotivationTradition     Motivation = "tradition"
	MotivationMechanics     Motivation = "mechanics"
)

type UserForm struct {
	// For tests
	Prop1 string
	Prop2 string
	// Actual stuff
	PlayStyle  PlayStyle
	PriceRange PriceRange
	Frequency  Frequency
	Risk       Risk
	Simplicity Simplicity
	Format     Format
	Type       Type
	Motivation []Motivation
}
