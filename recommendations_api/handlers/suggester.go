package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/SomeSuperCoder/global-chat/internal/recommendations"
	"github.com/SomeSuperCoder/global-chat/models"
)

type SuggesterHandlerRequest struct {
	UserForm        models.UserForm         `json:"user_form"`
	Recommendations []models.Recommendation `json:"recommendations"`
}

func SuggesterHandler(w http.ResponseWriter, r *http.Request) {
	request, exit := ReadRequestBodyAs[SuggesterHandlerRequest](w, r)
	if exit {
		return
	}

	result, err := recommendations.GetSuggestionsFor(&request.UserForm, request.Recommendations)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
