package recommendations

import (
	"log"
	"testing"

	"github.com/SomeSuperCoder/global-chat/models"
)

func asAnySlice[T any](s []T) []any {
	anySlice := make([]any, len(s))
	for i, v := range s {
		anySlice[i] = v
	}
	return anySlice
}

func TestSuggester(t *testing.T) {
	testForm := &models.UserForm{
		Prop1: "expensive",
		Prop2: "simple",
	}
	recommendations := []models.Recommendation{
		{
			Payload: models.Lotery{
				Name: "First lotery",
			},
			Props: []models.Prop{
				{
					Field: "Prop1",
					AllowedValues: asAnySlice([]string{
						"cheap",
					}),
					PositiveWhy: "Not expensive",
					NegativeWhy: "",
				},
			},
		},
		{
			Payload: models.Lotery{
				Name: "Second lotery",
			},
			Props: []models.Prop{
				{
					Field: "Prop1",
					AllowedValues: asAnySlice([]string{
						"expensive",
					}),
					PositiveWhy: "",
					NegativeWhy: "",
				},
				{
					Field: "Prop2",
					AllowedValues: asAnySlice([]string{
						"simple",
						"moderate",
					}),
					PositiveWhy: "Simple enough for you",
					NegativeWhy: "Too complicated for you!",
				},
			},
		},
	}

	result, err := GetSuggestionsFor(testForm, recommendations)
	if err != nil {
		t.Error(err)
	}
	log.Println(result)
}

func TestDiffPercentage(t *testing.T) {
	if DiffPercentage(100, 10) != -0.9 {
		t.Fail()
	}
	if DiffPercentage(4, 5) != 0.25 {
		t.Fail()
	}
}
