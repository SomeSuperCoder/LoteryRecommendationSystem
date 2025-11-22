package models

type Recommendation struct {
	Payload Lotery `json:"payload"`
	Props   []Prop `json:"props"`
}

type Prop struct {
	Field         string `json:"field"`
	AllowedValues []any  `json:"allowed_values"`
}

type Lotery struct {
	Name string `json:"name"`
}
