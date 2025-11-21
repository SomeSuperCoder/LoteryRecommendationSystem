package recommendations

import (
	"context"
	"fmt"
	"reflect"

	"github.com/SomeSuperCoder/global-chat/models"
)

func GetSuggestionsFor(ctx context.Context, former *models.UserForm, recommendations []models.Recommendation) (*models.Response, error) {
	entries := make([]models.ResponseEntry, len(recommendations))

	for i, recommendation := range recommendations {
		// Define prop categories
		goodProps := make([]models.Prop, 0)
		badProps := make([]models.Prop, 0)

		// Go through all props and categoroze them
		for _, prop := range recommendation.Props {
			doesFullfil, err := DoesFullfilCondition(former, prop)
			if err != nil {
				return nil, err
			}
			if doesFullfil {
				goodProps = append(goodProps, prop)
			} else {
				badProps = append(badProps, prop)
			}
		}

		// Write the result to the entries list
		entries[i] = models.ResponseEntry{
			Payload:   recommendation.Payload,
			GoodProps: goodProps,
			BadProps:  badProps,
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

	currentFieldValue := field.Interface()
	for _, desiredValue := range condition.AllowedValues {
		equal := reflect.DeepEqual(currentFieldValue, desiredValue)
		if equal {
			return true, nil
		}
	}

	return false, nil
}
