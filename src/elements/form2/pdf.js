import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";

// Create styles

// Create Document Component
export default function MyDocument(data) {
  console.log("pdf");
  console.log(data);
  let sintomas = [];
  let sintomastext = "";
  if (data.data.sintomaFiebre) {
    sintomas.push("fiebre");
  }
  if (data.data.sintomaDolorCabeza) {
    sintomas.push("dolor de cabeza");
  }
  if (data.data.sintomaTos) {
    sintomas.push("tos");
  }
  if (data.data.sintomaIrritabilidad) {
    sintomas.push("irritabilidad");
  }
  if (data.data.sintomaCongestion) {
    sintomas.push("congestión");
  }
  if (data.data.sintomaDiarrea) {
    sintomas.push("diarrea");
  }
  if (data.data.sintomaRespiracion) {
    sintomas.push("problemas de respiración");
  }
  if (data.data.sintomaOlor) {
    sintomas.push("pérdida del sentido de olfato");
  }
  if (sintomas.length) {
    sintomastext =
      "presento el o los siguientes síntomas: " +
      sintomas.join(", ").replace(/, ([^,]*)$/, " y $1");
  } else {
    sintomastext = " no presento ningún síntoma relacionado al COVID-19";
  }

  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.ntitle}>
          Proyecto Especial Legado Juegos Panamericanos
        </Text>
        <Image style={styles.image} src="./logo.png" />
        <Text style={styles.date}>
          Lima, {moment().locale("es").format("LL")}
        </Text>
        <Text style={styles.title}>Declaración Jurada COVID 19</Text>
        <Text style={styles.text}>
          Yo, {data.data.nombres.trim()} {data.data.apellidos.trim()},
          identificado con Documento de identidad N° {data.data.nroDoc.trim()},
          declaro bajo juramento que <Text>{sintomastext}</Text>.
        </Text>
        <Text style={styles.line}>
          __________________________________________________
        </Text>
        <Text style={styles.spawn}>
          {data.data.nombres.trim()} {data.data.apellidos.trim()}
        </Text>
        <Text style={styles.nheader}>Documento N° {data.data.nroDoc}</Text>
        <Text style={styles.pageNumber} fixed>
          Presentar este documento firmado al personal de control de acceso
        </Text>
      </Page>
    </Document>
  );
}

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

Font.register({
  family: "NotoSans",
  src: "./fonts/NotoSans/subset-NotoSans.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  ntitle: {
    fontSize: 11,
    textAlign: "center",
    family: "NotoSans",
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: -10,
  },
  spawn: {
    fontSize: 14,
    width: "100%",
    textAlign: "center",
  },
  line: {
    marginTop: 100,
    textAlign: "center",
    fontSize: 10,
    marginBottom: 5,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "NotoSans",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  text: {
    margin: 12,
    fontSize: 14,
    marginTop: 0,
    textAlign: "justify",
    fontFamily: "NotoSans",
    marginBottom: 10,
  },
  image: {
    marginLeft: "35%",
    width: 10,
    marginBottom: 50,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  nheader: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  date: {
    fontSize: 10,
    marginBottom: 60,
    textAlign: "left",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
