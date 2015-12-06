package main

// import "golang.org/x/net/websocket"
import (
	"encoding/json"
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

// func (p *peer) write(messageType int, message []byte) error {
// 	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
// 	return c.conn.WriteMessage(messageType, message)
// }

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

var partner = make(chan io.ReadWriteCloser)

type socketData struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
	// Data  map[string]interface{} `json:"data"`
}

func match(c io.ReadWriteCloser) {
	log.Println("Waiting for a partner...")
	select {
	case partner <- c:

		data := socketData{"user_connected", true}
		jsonData, err := json.Marshal(data)
		if err != nil {
			log.Fatal("Unable to marshal JSON data.")
		}

		c.Write(jsonData)
		log.Println("Giving away the connection.")
		// now handled by the other goroutine
	case p := <-partner:
		log.Println("Getting the connection.")
		broker(p, c)
	}
}

func broker(a, b io.ReadWriteCloser) {
	// fmt.Fprintln(a, "Found one! Say hi.")
	// fmt.Fprintln(b, "Found one! Say hi.")
	// errc := make(chan error, 1)
	// go cp(a, b, errc)
	// go cp(b, a, errc)
	// if err := <-errc; err != nil {
	//         log.Println(err)
	// }
	// a.Close()
	// b.Close()
}
