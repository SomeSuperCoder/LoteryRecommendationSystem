package models

type Response struct {
	Recommendations []ResponseEntry
}

type ResponseEntry struct {
	Payload   Lotery
	GoodProps []PropResult
	BadProps  []PropResult
}

type PropResult struct {
	Why string
}
