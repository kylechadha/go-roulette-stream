package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"golang.org/x/net/websocket"
)

func newRouter() *mux.Router {

	// Create a new mux Router.
	router := mux.NewRouter().StrictSlash(true)

	// WebSocket routes.
	router.Handle("/ws", websocket.Handler(socketHandler))

	// Public routes.
	router.PathPrefix("/libs").Handler(http.FileServer(http.Dir("./public/")))
	router.PathPrefix("/scripts").Handler(http.FileServer(http.Dir("./public/")))
	router.PathPrefix("/styles").Handler(http.FileServer(http.Dir("./public/")))
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/views")))

	return router
}
