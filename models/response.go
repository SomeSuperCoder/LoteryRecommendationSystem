package models

type Response struct {
	Recommendations []ResponseEntry
}

type ResponseEntry struct {
	Payload   Lotery
	GoodProps []Prop
	BadProps  []Prop
}
