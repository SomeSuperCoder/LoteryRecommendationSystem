package handlers

import (
	"encoding/json"
	"net/http"
)

func ReadRequestBodyAs[T any](w http.ResponseWriter, r *http.Request) (*T, bool) {
	var data *T
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return nil, true
	}

	return data, false
}
