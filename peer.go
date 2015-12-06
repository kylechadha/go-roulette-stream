package main

// import "golang.org/x/net/websocket"
import (
	"fmt"
	"io"
	"log"

	"golang.org/x/net/websocket"
)

// Define the peer struct.
type peer struct {
	// conn *websocket.Conn // or just io.ReadWriter
	io.ReadWriter
	done chan bool
}

func (p peer) Close() error {
	p.done <- true
	return nil
}

func socketHandler(ws *websocket.Conn) {
	log.Println("Socket connection opened.")

	p := peer{ws, make(chan bool)} // HL
	go match(p)
	<-p.done
}

// END OMIT

var partner = make(chan io.ReadWriteCloser)

func match(c io.ReadWriteCloser) {
	log.Println("Waiting for a partner...")
	select {
	case partner <- c:
		log.Println("Giving away the connection.")
		// now handled by the other goroutine
	case p := <-partner:
		log.Println("Getting the connection.")
		chat(p, c)
	}
}

func chat(a, b io.ReadWriteCloser) {
	fmt.Fprintln(a, "Found one! Say hi.")
	fmt.Fprintln(b, "Found one! Say hi.")
	// errc := make(chan error, 1)
	// go cp(a, b, errc)
	// go cp(b, a, errc)
	// if err := <-errc; err != nil {
	//         log.Println(err)
	// }
	// a.Close()
	// b.Close()
}
