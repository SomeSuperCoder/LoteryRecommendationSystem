package handlers

import (
	"encoding/json"
	"log"
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

	log.Println(request)

	recommendations.DefaultKs(&request.Desired)
	desired := request.Desired.AsUniversalProps()

	result := recommendations.BestOf(desired, request.RealValues)

	json.NewEncoder(w).Encode(result)
}
