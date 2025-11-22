package recommendations

import (
	"fmt"
	"reflect"

	"github.com/SomeSuperCoder/global-chat/models"
)

func GetSuggestionsFor(form *models.UserForm, recommendations []models.Recommendation) (*models.Response, error) {
	entries := make([]models.Lotery, 0)

	for _, recommendation := range recommendations {
		// Go through all props and categoroze them
		for _, prop := range recommendation.Props {
			doesFullfil, err := DoesFullfilCondition(form, prop)
			if err != nil {
				return nil, err
			}
			if doesFullfil {
				// Write the result to the entries list
				entries = append(entries, recommendation.Payload)
			}
		}

	}

	return &models.Response{
		Recommendations: entries,
	}, nil
}

func DoesFullfilCondition(obj any, condition models.Prop) (bool, error) {
	v := reflect.ValueOf(obj)

	if v.Kind() == reflect.Pointer {
		v = v.Elem()
	}

	if v.Kind() != reflect.Struct {
		return false, fmt.Errorf("provided value is not a struct")
	}

	field := v.FieldByName(condition.Field)
	if !field.IsValid() {
		return false, fmt.Errorf("field %s not found", condition.Field)
	}

	if !field.IsValid() || field.Kind() != reflect.String {
		return false, fmt.Errorf("field %s is not a valid string", condition.Field)
	}

	str := field.String()

	for _, desiredValue := range condition.AllowedValues {
		if str == desiredValue {
			return true, nil
		}
	}
	// --------------------------------------

	return false, nil
}
