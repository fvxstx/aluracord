import React, { useEffect, useState } from "react";
import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

import appConfig from "../config.json";

import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2NTcxNCwiZXhwIjoxOTU5MDQxNzE0fQ.bHOeZN9V4GZT0Xi23iDo-j_xJjzB4WqOsC0Cn6aY21E";
const SUPABASE_URL = "https://bmpdirefbotefpsqofrn.supabase.co";
/* Pegando o db dentro do supabase */
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function realTimeMessage(addMessage) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (res) => {
      addMessage(res.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const userLogado = router.query.username;

  const [listaMensagens, setListaMensagens] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data);
      });

    realTimeMessage((newMessage) => {
      setListaMensagens((atualLista) => {
        return [newMessage, ...atualLista];
      });
    });
  }, []);

  function handleNewMessage(newMessage) {
    const mensagemInfos = {
      de: userLogado,
      texto: newMessage,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagemInfos])
      .then(({ data }) => {});

    setMensagem("");
  }

  function handleRemoveMessage(keyMessage) {
    const newListMessage = listaMensagens.filter((mensage) => {
      return mensage.id !== keyMessage;
    });

    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: keyMessage })
      .then(({ data }) => {});

    setListaMensagens([...newListMessage]);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <Box
            tag="ul"
            styleSheet={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              flex: 1,
              color: appConfig.theme.colors.neutrals["000"],
              marginBottom: "16px",
            }}
          >
            {listaMensagens.map((mensagem) => {
              return (
                <MessageList
                  mensagem={mensagem}
                  key={mensagem.id}
                  press={handleRemoveMessage}
                />
              );
            })}
          </Box>

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const value = event.target.value;
                setMensagem(value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNewMessage(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                height: "100%",
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Box
              styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "5px",
              }}
            >
              <ButtonSendSticker
                onStickerClick={(sticker) => {
                  handleNewMessage(`:sticker:${sticker}`);
                }}
              />
              <Button
                label="Enter"
                variant="primary"
                colorVariant="positive"
                onClick={() => {
                  handleNewMessage(mensagem);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({ mensagem, press }) {
  return (
    <Text
      key={mensagem.id}
      tag="li"
      styleSheet={{
        borderRadius: "5px",
        padding: "6px",
        marginBottom: "12px",
        hover: {
          backgroundColor: appConfig.theme.colors.neutrals[700],
        },
      }}
    >
      <Box
        styleSheet={{
          marginBottom: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Image
            styleSheet={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "8px",
            }}
            src={`https://github.com/${mensagem.de}.png`}
          />
          <Text tag="strong">{mensagem.de}</Text>
          <Text
            styleSheet={{
              fontSize: "10px",
              marginLeft: "8px",
              color: appConfig.theme.colors.neutrals[300],
            }}
            tag="span"
          >
            {new Date().toLocaleDateString()}
          </Text>
        </Box>

        <Button
          label="X"
          variant="tertiary"
          colorVariant="negative"
          onClick={() => {
            press(mensagem.id);
          }}
        />
      </Box>
      {mensagem.texto.startsWith(":sticker:") ? (
        <Image src={mensagem.texto.replace(":sticker:", "")} />
      ) : (
        mensagem.texto
      )}
    </Text>
  );
}
