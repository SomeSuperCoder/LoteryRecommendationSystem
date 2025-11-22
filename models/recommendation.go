package models

type Recommendation struct {
	Payload Lotery
	Props   []Prop
}

type Prop struct {
	Field         string
	AllowedValues []any
}

type AllowedValue struct {
	Value any
}

type Lotery struct {
	Name string
}
