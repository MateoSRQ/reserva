import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  notification,
  Typography,
} from "antd";
import "antd/dist/antd.css";
import "./App.css";
import style from "./app.module.css";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import styles from "./registro.module.css";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
//import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";

//import PDF from "./pdf";
const { Title, Paragraph, Text } = Typography;
const ids = ["1"];

function App() {
  const [data, setData] = useState({});
  const [buttonText, setButtonText] = useState("Enviar formulario");
  const [saved, setSaved] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleChange = (key, value) => {
    console.log("handleChange");
    console.log("key: " + key + " value: " + value);
    let _data = Object.assign({}, data);
    if (value.isString) {
      value = value.trim();
    }
    _data[key] = value;

    console.log("xxx");
    console.log(_data["sintomaFiebre"]);

    if (key === "sintomaNo" && value === true) {
      _data["sintomaFiebre"] = false;
      _data["sintomaTos"] = false;
      _data["sintomaDolorCabeza"] = false;
      _data["sintomaIrritabilidad"] = false;
      _data["sintomaIrritabilidad"] = false;
      _data["sintomaCongestion"] = false;
      _data["sintomaDiarrea"] = false;
      _data["sintomaRespiracion"] = false;
      data["sintomaOlor"] = false;
      data["sintomaSabor"] = false;
    }

    if (
      _data["sintomaFiebre"] ||
      _data["sintomaTos"] ||
      _data["sintomaDolorCabeza"] ||
      _data["sintomaIrritabilidad"] ||
      _data["sintomaIrritabilidad"] ||
      _data["sintomaCongestion"] ||
      _data["sintomaDiarrea"] ||
      _data["sintomaRespiracion"] ||
      data["sintomaOlor"] ||
      data["sintomaSabor"]
    ) {
      _data["sintomaNo"] = false;
      setButtonText("Enviar reporte a Proyecto Legado");
      notification.warning({
        message: "Alerta",
        description:
          "Si ud. presenta un síntoma, no podrá ingresar a las instalaciones",
        duration: 2,
      });
    } else {
      setButtonText("Enviar formulario");
    }

    if (
      _data.nombres !== null &&
      _data.nombres !== "" &&
      _data.nombres !== undefined &&
      _data.apellidos !== null &&
      _data.apellidos !== "" &&
      _data.apellidos !== undefined &&
      _data.nro_doc !== null &&
      _data.nro_doc !== "" &&
      _data.nro_doc !== undefined &&
      _data.celular !== null &&
      _data.celular !== "" &&
      _data.celular !== undefined &&
      _data.ddjj === true
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
    console.log(_data);
    setData(_data);
    console.log(data);
  };
  const sendData = async () => {
    let { ddjj, ..._data } = data;

    _data.apto = buttonText === "Enviar formulario" ? 1 : 0;
    for (let d in _data) {
      if (_data[d] === true) _data[d] = "T";
      if (_data[d] === false) _data[d] = "F";
    }
    console.log(_data);
    try {
      let r = await axios({
        method: "post",
        url: process.env.REACT_APP_ENDPOINT + "/cuestionarioempleado",
        data: _data,
      });
      setSaved(true);
      notification.success({
        message: "OK",
        description: "Su cuestionario ha sido llenado satisfactoriamente",
        duration: 0,
      });
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Error",
        description: "El registro no ha podido ser guardado.",
        duration: 0,
      });
    }
  };

  let handleBlur = async () => {
    console.log("blur");
    try {
      let x = await axios({
        method: "get",
        url:
          'http://127.0.0.1:3000/cuestionarios?filter={"where":{"nro_doc":{"eq":' +
          data.nro_doc +
          "}}}",
      });
      x = x.data;
      console.log(x);
      if (x && x[0]) {
        setData({
          nro_doc: x[0].nro_doc,
          nombres: x[0].nombres,
          apellidos: x[0].apellidos,
          celular: x[0].celular,
          // empresa: x[0].empresa,
          // area: x[0].area,
          // puesto: x[0].puesto,
        });
      }
    } catch (e) {}
  };

  let link = null;
  //
  // if (saved) {
  //   // link = (
  //   //   <PDFDownloadLink document={<PDF data={data} />} fileName="somename.pdf">
  //   //     {({ blob, url, loading, error }) =>
  //   //       loading ? "Cargando documento..." : "Descargar archivo PDF"
  //   //     }
  //   //   </PDFDownloadLink>
  //   // );
  //   link = null;
  // }

  let view = (
    <div className="App">
      <Card
        className={style.column}
        title="FICHA DE SÍNTOMAS COVID-19"
        bordered={true}
      >
        <div style={{ marginBottom: "20px" }}>
          <Image width="260px" src={`./logo.png`} />
        </div>
        <Form id="form" layout="vertical">
          <div className={style.date}>
            {moment().locale("es").format("LLLL")}
          </div>
          <Title level={4}>Datos Generales</Title>
          <Divider />
          <Form.Item label="Documento de Identidad">
            <Input
              value={data.nro_doc}
              placeholder="Ingrese su documento de identidad"
              onChange={(e) => handleChange("nro_doc", e.currentTarget.value)}
              onBlur={handleBlur}
            />
          </Form.Item>
          <Form.Item label="Nombres">
            <Input
              value={data.nombres}
              placeholder="Ingrese sus nombres completos"
              onChange={(e) => handleChange("nombres", e.currentTarget.value)}
            />
          </Form.Item>
          <Form.Item label="Apellidos">
            <Input
              value={data.apellidos}
              placeholder="Ingrese sus apellidos"
              onChange={(e) => handleChange("apellidos", e.currentTarget.value)}
            />
          </Form.Item>
          <Form.Item label="Celular">
            <Input
              value={data.celular}
              placeholder="Celular"
              onChange={(e) => handleChange("celular", e.currentTarget.value)}
            />
          </Form.Item>
          {/*<Form.Item label="Empresa">*/}
          {/*  <Input*/}
          {/*    value={data.empresa}*/}
          {/*    placeholder="Empresa"*/}
          {/*    onChange={(e) => handleChange("empresa", e.currentTarget.value)}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="Área de trabajo">*/}
          {/*  <Input*/}
          {/*    value={data.area}*/}
          {/*    placeholder="Área de trabajo"*/}
          {/*    onChange={(e) => handleChange("area", e.currentTarget.value)}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="Puesto de trabajo">*/}
          {/*  <Input*/}
          {/*    value={data.puesto}*/}
          {/*    placeholder="Puesto de trabajo"*/}
          {/*    onChange={(e) => handleChange("puesto", e.currentTarget.value)}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          <Divider />
          <Title level={4}>
            Marque en caso de tener los siguientes malestares
          </Title>
          <Form.Item>
            <div>
              <Checkbox
                checked={data.sintomaFiebre}
                onChange={(e) =>
                  handleChange("sintomaFiebre", e.target.checked)
                }
              >
                Fiebre
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaDolorCabeza}
                onChange={(e) =>
                  handleChange("sintomaDolorCabeza", e.target.checked)
                }
              >
                Dolor de cabeza
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaTos}
                onChange={(e) => handleChange("sintomaTos", e.target.checked)}
              >
                Tos
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaIrritabilidad}
                checked={data.sintomaIrritabilidad}
                onChange={(e) =>
                  handleChange("sintomaIrritabilidad", e.target.checked)
                }
              >
                Irritabilidad
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaCongestion}
                onChange={(e) =>
                  handleChange("sintomaCongestion", e.target.checked)
                }
              >
                Congestiòn nasal
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaDiarrea}
                onChange={(e) =>
                  handleChange("sintomaDiarrea", e.target.checked)
                }
              >
                Diarrea
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaRespiracion}
                onChange={(e) =>
                  handleChange("sintomaRespiracion", e.target.checked)
                }
              >
                Dificultad para respirar
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaOlor}
                onChange={(e) => handleChange("sintomaOlor", e.target.checked)}
              >
                No percibo olores
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaSabor}
                onChange={(e) => handleChange("sintomaSabor", e.target.checked)}
              >
                No percibo sabores
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={data.sintomaNo}
                onChange={(e) => handleChange("sintomaNo", e.target.checked)}
              >
                No tengo ninguno de los síntomas descritos
              </Checkbox>
            </div>
          </Form.Item>
          <Divider />
          {/*<Title level={4}>Medición de temperatura</Title>*/}
          {/*<Form.Item style={{width: '90%', marginLeft: '5%'}}>*/}
          {/*  <Slider range marks={marks} defaultValue={[36]} min={35} max={40} step={.1}/>*/}
          {/*</Form.Item>*/}
          {/*<Divider/>*/}
          <Form.Item>
            <Checkbox
              onChange={(e) => handleChange("ddjj", e.target.checked)}
              style={{ textAlign: "left" }}
            >
              Declaro que los datos consignados aquí son verdaderos, con calidad
              de declaración jurada.
            </Checkbox>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              block
              onClick={sendData}
              disabled={buttonDisabled}
            >
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
        {/*{link}*/}
      </Card>
    </div>
  );
  return view;
}

export default App;
