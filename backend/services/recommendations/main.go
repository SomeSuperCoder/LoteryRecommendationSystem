package main

import (
	"log"
	"net/http"

	"github.com/SomeSuperCoder/global-chat/handlers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /suggester", handlers.SuggesterHandler)
	mux.HandleFunc("POST /best_of", handlers.BestOfHandler)

	log.Println("Server listening on :8090")
	err := http.ListenAndServe(":8090", mux)
	log.Fatal(err)
}
