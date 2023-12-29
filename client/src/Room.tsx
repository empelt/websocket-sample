import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  HStack,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";

import ReconnectingWebSocket from "reconnecting-websocket";
import { Message } from "./types/Message";

export default function Room() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const word = searchParams.get("word");
  const name = searchParams.get("name");

  if (!word || !name) {
    navigate("Home");
    return null;
  }
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [message, setMessage] = React.useState<string>("");
  const socketRef = React.useRef<ReconnectingWebSocket>();

  React.useEffect(() => {
    const websocket = new ReconnectingWebSocket(
      `ws://localhost:1323/rooms/${word}/ws`
    );
    socketRef.current = websocket;

    const onMessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as Message;
      setMessages((prev) => [...prev, message]);
    };
    websocket.addEventListener("message", onMessage);

    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
    };
  }, []);

  const onClick = () => {
    if (!message) return;
    const m = JSON.stringify({ from: name, text: message });
    socketRef.current?.send(m);
    setMessage("");
  };

  return (
    <Container pt={20}>
      <Card>
        <CardBody>
          <HStack mb={8}>
            <FormControl>
              <Input
                placeholder="メッセージ"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </FormControl>
            <Button colorScheme="teal" alignSelf={"end"} onClick={onClick}>
              送信
            </Button>
          </HStack>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
              >{`${message.from}: ${message.text}`}</ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </Container>
  );
}
