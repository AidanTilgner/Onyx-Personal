package handlers

import (
	"net/http"
)

func HandlePackage(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("you've reached the package handler"))
}
