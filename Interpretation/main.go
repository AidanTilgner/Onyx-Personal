package main

import (
	h "onyx-interpretation-server/handlers"
	"time"

	"github.com/kataras/iris/v12"
)

func main() {
	app := iris.Default()
	app.Use(myMiddleware)

	app.Handle("POST", "/nlu", func(ctx iris.Context) {
		res := make(chan string)
		go h.RecieveNLU(ctx, res)

		select {
		case result := <-res:
			ctx.JSON(iris.Map{"message": result})
			return
		case <-time.After(time.Second * 5):
			ctx.JSON(iris.Map{"message": "Timeout"})
			return
		}
	})

	app.Listen(":5001")
}

func myMiddleware(ctx iris.Context) {
	ctx.WriteString("Hello World!")
	ctx.Next()
}
