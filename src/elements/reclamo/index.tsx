import React, { useState } from "react";
import { Layout, Space, Divider, Row, Col, Button } from "antd";
import { Typography } from "antd";
import { Form, Input, Radio } from "antd";
import { Select, DatePicker, Checkbox } from "antd";
import ClientCaptcha from "react-client-captcha";
import styles from "./styles.module.css";
import "antd/dist/antd.compact.min.css";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { parse, format } from "date-fns";

import { IconContext } from "react-icons";
import { MdApps } from "react-icons/md";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

function Page() {
  const [form] = Form.useForm();
  const onFormChange = () => {};
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);

  const onFinish = (e: any) => {
    console.log("onFinish");
    e.fecha = e.fecha.format("YYYY-MM-DD");
    if (e.archivo?.file?.response?.coded) {
      e.file = e.archivo?.file.response.coded;
    }
    console.log(e);
  };
  return (
    <div className={styles.page}>
      <div className={styles.menuItem}>
        <div className={styles.item}>
          <Title
            style={{
              textAlign: "center",
              margin: "10px",
              color: "#0066ff",
              textTransform: "uppercase",
            }}
            level={3}
          >
            Datos de reclamo
          </Title>
          <Divider />
          <Row gutter={16}>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={onFormChange}
              onFinish={onFinish}
              style={{ width: "100%" }}
            >
              <Form.Item
                label="¿En qué sede ocurrió el incidente?"
                name="sede"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una sede!",
                  },
                ]}
              >
                <Select style={{ width: "100%" }}>
                  <Option value="VIDENA">VIDENA</Option>
                  <Option value="Costa verde">Costa Verde</Option>
                  <Option value="virtual">Página web / Virtual</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="¿En qué fecha ocurrió el incidente?"
                name="fecha"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una fecha!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="¿Qué sucedió?"
                name="descripcion"
                rules={[
                  {
                    required: true,
                    message:
                      "Por favor, escriba una breve descripción del incidente!",
                  },
                ]}
              >
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item
                label="Identifica el motivo del reclamo."
                name="motivo"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione un motivo!",
                  },
                ]}
              >
                <Select style={{ width: "100%" }}>
                  <Option value={0}>
                    <div>
                      <b>Trato profesional en la atención</b>
                    </div>
                    <div>
                      La persona que te atendió no lo hizo de forma adecuada.
                    </div>
                  </Option>
                  <Option value={1}>
                    <div>
                      <b>Tiempo</b>
                    </div>
                    <div>
                      Hubo demora antes y/o durante la atención que recibiste.
                    </div>
                  </Option>
                  <Option value={2}>
                    <div>
                      <b>Procedimiento</b>
                    </div>
                    <div>
                      No se siguió el procedimiento de atención o no estás de
                      acuerdo con este.
                    </div>
                  </Option>
                  <Option value={3}>
                    <div>
                      <b>Infraestructura</b>
                    </div>
                    <div>
                      El ambiente en el que se realizó la atención y/o
                      mobiliario no están en buen estado, no hay rutas
                      accesibles que faciliten el desplazamiento de las personas
                      o el local queda en un sitio inseguro.
                    </div>
                  </Option>
                  <Option value={4}>
                    <div>
                      <b>Información</b>
                    </div>
                    <div>
                      La orientación sobre el servicio fue inadecuada,
                      insuficiente o imprecisa.
                    </div>
                  </Option>
                  <Option value={5}>
                    <div>
                      <b>Resultado</b>
                    </div>
                    <div>
                      No se pudo obtener un resultado concreto como parte del
                      servicio y/o no se justifica la negativa en la atención
                      del servicio.
                    </div>
                  </Option>
                  <Option value={6}>
                    <div>
                      <b>Confianza</b>
                    </div>
                    <div>
                      Ocurrió una situación que afectó la confianza y
                      credibilidad de la entidad.
                    </div>
                  </Option>
                  <Option value={7}>
                    <div>
                      <b>Disponibilidad</b>
                    </div>
                    <div>
                      El medio de atención (virtual, presencial o telefónico)
                      por el que se brinda el servicio no responde a tus
                      expectativas o tiene horarios restringidos.
                    </div>
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="¿Trataron de darte una solución previa al registro del reclamo?"
                name="solucion"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una respuesta!",
                  },
                ]}
              >
                <Select style={{ width: "100%" }}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Puede subir un archivo que permita evidenciar su reclamo"
                name="archivo"
              >
                <Upload action={process.env.REACT_APP_ENDPOINT + "/file"}>
                  <Button icon={<UploadOutlined />}>
                    Presionar para cargar archivo
                  </Button>
                </Upload>
              </Form.Item>
              <Title
                style={{
                  textAlign: "center",
                  margin: "10px",
                  color: "#0066ff",
                  textTransform: "uppercase",
                }}
                level={3}
              >
                Datos Personales
              </Title>

              <Form.Item
                label="Nombres"
                name="nombres"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese sus nombres!",
                  },
                ]}
              >
                <Input
                  //value={data.nombres}
                  placeholder="Ingrese sus nombres completos"

                  //onChange={(e) => handleChange("nombres", e.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item
                label="Apellidos"
                name="apellidos"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione sus apellidos!",
                  },
                ]}
              >
                <Input
                  //value={data.apellidos}
                  placeholder="Ingrese sus apellidos"
                  //onChange={(e) => handleChange("apellidos", e.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item
                label="Documento de Identidad"
                name="documento"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su documento de identidad!",
                  },
                ]}
              >
                <Input
                  //value={data.nro_doc}
                  placeholder="Ingrese su documento de identidad"
                  //onChange={(e) => handleChange("nro_doc", e.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item
                label="Correo electrónico"
                name="correo"
                rules={[
                  {
                    required: true,
                    message:
                      "Por favor, ingrese sus dirección de correo electrónico!",
                  },
                ]}
              >
                <Input
                  //value={data.nro_doc}
                  placeholder="Ingrese su correo electrónico"
                  //onChange={(e) => handleChange("nro_doc", e.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item
                label="Celular"
                name="telefono"
                rules={[
                  {
                    required: true,
                    message:
                      "Por favor, ingrese su número de teléfono celular!",
                  },
                ]}
              >
                <Input
                  //value={data.celular}
                  placeholder="Celular"
                  //onChange={(e) => handleChange("celular", e.currentTarget.value)}
                />
              </Form.Item>
              <Row>
                <ClientCaptcha
                  captchaCode={(code: string) => {
                    setCode(code);
                  }}
                />
              </Row>
              <Form.Item
                label="Código de verificación"
                name="codigo"
                rules={[
                  () => ({
                    validator(_, value) {
                      console.log(value + "," + code);
                      if (value === code) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Por favor, ingrese el código mostrado!"
                      );
                    },
                  }),
                ]}
              >
                <Input
                  //value={data.celular}
                  placeholder="Código"
                  //onChange={(e) => handleChange("celular", e.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item style={{ marginTop: "20px" }}>
                <Button type="primary" size="large" htmlType="submit" block>
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Page;
