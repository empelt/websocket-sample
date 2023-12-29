package main

import (
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.GET("/rooms/:id/ws", serveWs)

	e.Logger.Fatal(e.Start(":1323"))
}