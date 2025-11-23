package main

import (
	"log"
	"net/http"

	"github.com/SomeSuperCoder/global-chat/handlers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET  /draws", handlers.HandleDraws)
	mux.HandleFunc("GET  /draw", handlers.HandleDraw)
	mux.HandleFunc("GET  /draw/latest", handlers.HandleDrawLatest)
	mux.HandleFunc("GET  /draw/prelatest", handlers.HandleDrawPreLatest)
	mux.HandleFunc("GET  /draw/momental", handlers.HandleMomentalCards)

	log.Println("Server listening on :9090")
	err := http.ListenAndServe(":9090", mux)
	log.Fatal(err)
}
