package models

type Recommendation struct {
	Payload Lotery
	Props   []Prop
}

type Prop struct {
	Field         string
	AllowedValues []any
}

type Lotery struct {
	Name string
}
