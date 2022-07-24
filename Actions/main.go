package main

import (
	"net/http"

	h "onyx-action-server/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Route("/package-hook", func(r chi.Router) {
		r.Get("/", h.HandlePackage)
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})

	http.ListenAndServe(":5055", r)
}
