package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/SomeSuperCoder/global-chat/internal/recommendations"
	"github.com/SomeSuperCoder/global-chat/models"
)

type BestOfHandlerRequest struct {
	Desired    models.UniversalPropsWithK `json:"universal_props_with_k"`
	RealValues []models.UniversalProps    `json:"real_values"`
}

func BestOfHandler(w http.ResponseWriter, r *http.Request) {
	request, exit := ReadRequestBodyAs[BestOfHandlerRequest](w, r)
	if exit {
		return
	}

	recommendations.DefaultKs(&request.Desired)

	result := recommendations.BestOf(&request.Desired, request.RealValues)

	json.NewEncoder(w).Encode(result)
}
