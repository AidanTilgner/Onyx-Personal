package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/kataras/iris/v12"
)

func RecieveNLU(ctx iris.Context, res chan string) {
	// "sender": "test_user",  // sender ID of the user sending the message
	//   "message": "Hi there!"
	// Make a map out of that
	body := map[string]string{"sender": "test_user", "message": "Hi there!"}

	// make a request to http://localhost:5002/
	// with the body of the map
	// and the method of POST
	// and the content type of application/json
	// and the response type of json
	requestBody, err := json.Marshal(body)
	resp, err := http.Post("http://localhost:5002/", "application/json", bytes.NewBuffer(requestBody))

	if err != nil {
		res <- "Error"
		return
	}

	// read the response body
	// and send it to the channel
	// so that the main function can handle it
	body = make(map[string]string)
	json.NewDecoder(resp.Body).Decode(&body)
	res <- body["message"]

	// close the response body
	// so that it can be read again
	defer resp.Body.Close()
}
