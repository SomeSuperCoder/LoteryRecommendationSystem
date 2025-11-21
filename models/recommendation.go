package models

type Recommendation struct {
	Payload Lotery
	Props   []Prop
}

type Prop struct {
	Field         string
	AllowedValues []any
	PositiveWhy   string
	NegativeWhy   string
}

type AllowedValue struct {
	Value any
}

type Lotery struct {
	Name string
}
