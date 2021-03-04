import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import _ from "lodash";

import "antd/dist/antd.css";
import styles from "./element.module.css";
import distritos from "../../data/distritos.json";
import TextArea from "antd/es/input/TextArea";
import "moment/locale/es";
import locale from "antd/es/date-picker/locale/es_ES";
import { format, parse } from "date-fns";

const { Title } = Typography;
const { Option } = Select;

export default function Element() {
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState<any | null>(null);
  const [sede, setSede] = useState<any | null>(null);
  const [events, setEvents] = useState<any | null>(null);
  const [event, setEvent] = useState<any | null>(null);
  const [dates, setDates] = useState<any | null>(null);
  const [date, setDate] = useState<any | null>(null);
  const [hours, setHours] = useState<any | null>(null);
  const [hour, setHour] = useState<any | null>(null);
  const [quota, setQuota] = useState<any>(1);
  const [max, setMax] = useState<any>(0);
  const [min, setMin] = useState<any>(10000);

  const [modalOk, setModalOk] = useState<boolean>(false);
  const [modalNok, setModalNok] = useState<boolean>(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);

  const [checkbox1, setCheckbox1] = useState<boolean>(false);
  const [checkbox2, setCheckbox2] = useState<boolean>(false);
  const [checkbox3, setCheckbox3] = useState<boolean>(false);
  const [checkbox4, setCheckbox4] = useState<boolean>(false);

  useEffect(() => {
    console.log("START");

    async function loadSedes() {
      console.log("loadsedes");
      let data = await axios.get(
        process.env.REACT_APP_ENDPOINT + "/places/places"
      );
      let resdata = _.uniq(_.map(data.data, "place"));
      let sedes_options = resdata.map((option: any) => {
        return <Option value={option}>{option}</Option>;
      });
      setSedes(sedes_options);
    }

    loadSedes();
  }, []);

  const handleChangeSede = async (value: any) => {
    let data = await axios.get(
      process.env.REACT_APP_ENDPOINT +
        `/places/places?place=${value}&quota=${quota}`
    );
    let resdata = _.uniq(_.map(data.data, "name"));
    let event_options = resdata.map((option: any) => {
      return <Option value={option}>{option}</Option>;
    });
    setEvent(null);
    setDate(null);
    form.setFieldsValue({ event_id: null });
    setDates(null);
    setHours(null);
    setSede(value);
    setEvents(event_options);
  };
  const handleChangeEvent = async (value: any) => {
    let data = await axios.get(
      process.env.REACT_APP_ENDPOINT +
        `/places/places?place=${sede}&name=${value}&quota=${quota}`
    );
    let resdata = _.uniq(_.map(data.data, "date"));
    let date_options = resdata.map((option: any) => {
      let x = format(parse(option, "yyyy-mm-dd", new Date()), "dd/mm/yyyy");
      return <Option value={option}>{x}</Option>;
    });
    setEvent(value);
    setDate(null);
    form.setFieldsValue({ event_id: null });
    setDates(date_options);
  };
  const handleChangeDate = async (value: any) => {
    let data = await axios.get(
      process.env.REACT_APP_ENDPOINT +
        `/places/places?place=${sede}&name=${event}&date=${value}&quota=${quota}`
    );
    let hour_options = data.data.map((option: any) => {
      return (
        <Option key={JSON.stringify(option)} value={option.id}>
          {option.hourBegin} - {option.hourEnd}
        </Option>
      );
    });

    setDate(value);
    form.setFieldsValue({ event_id: null });
    setHours(hour_options);
  };
  const handleHourChange = async (value: any, index: any) => {
    const data = JSON.parse(index.key);
    console.log("handleHourChange");
    console.log(data);
    let _max = data.quota < data.hi ? data.quota : data.hi;
    setMax(_max);
    setMin(data.low);
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!checkbox4) {
      setModalWarning(true);
    } else {
      let response = await axios.post(
        process.env.REACT_APP_ENDPOINT + `/reservas`,
        values
      );
      if (response.data === "already there") {
        setModalNok(true);
      } else {
        setModalOk(true);
      }
      console.log(response.data);
    }
  };
  const onValuesChange = (values: any) => {
    //console.log("Change:", values);
    //console.log(form.getFieldsError());\
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const checkboxChange1 = (value: any) => {
    setCheckbox1(value.target.checked);
  };
  const checkboxChange2 = (value: any) => {
    setCheckbox2(value.target.checked);
  };
  const checkboxChange3 = (value: any) => {
    setCheckbox3(value.target.checked);
  };
  const checkboxChange4 = (value: any) => {
    setCheckbox4(value.target.checked);
  };
  const options = distritos.data.map((option: any) => {
    return <Option value={option}>{option}</Option>;
  });
  return (
    <div className={styles.element}>
      <div className={styles.form}>
        <div style={{ marginLeft: "calc(50% - 130px)", marginBottom: "20px" }}>
          <Image width="260px" src={`./logo.png`} />
        </div>
        <Title style={{ textAlign: "center", color: "#06356d" }} level={2}>
          Solicitud de reserva de espacios deportivos y no deportivos
        </Title>
        <Title
          style={{
            textAlign: "center",
            color: "#454545",
            marginTop: "-15px",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
          level={4}
        >
          PROYECTO LEGADO JUEGOS PANAMERICANOS Y PARAPANAMERICANOS
        </Title>
        <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
        <p
          style={{
            textAlign: "justify",
            marginLeft: "40px",
            marginRight: "40px",
          }}
        >
          IMPORTANTE Si desea realizar alguna actividad deportiva o recreativa
          en el{" "}
          <b>
            <i>
              Complejo Deportivo Andrés Avelino Cáceres de Villa María del
              Triunfo
            </i>
          </b>
          , sede a cargo del Proyecto Legado, tendrá que llenar este formulario
          con{" "}
          <b>
            <i>24 horas de anticipación</i>
          </b>{" "}
          (o el mismo día si todavía hay aforo ). Tener en cuenta que:
        </p>
        <ol
          style={{
            textAlign: "justify",
            marginLeft: "20px",
            marginRight: "40px",
          }}
        >
          <li>
            Lunes, miércoles y viernes, podrá utilizar la{" "}
            <b>
              <i>pista atlética</i>
            </b>{" "}
            o{" "}
            <b>
              <i>ciclovía.</i>
            </b>
          </li>
          <li>
            Martes y jueves, podrá hacer la reserva para{" "}
            <b>
              <i>Plaza de las Banderas.</i>
            </b>
          </li>
          <li>
            Si lo acompaña un menor de edad (de 0 meses hasta 17 años) tambien
            deberá incluirlo en el formulario, accediendo al campo: "Otros
            usuarios...".
          </li>
          <li>
            Una vez registrada su solicitud en el formulario, recibirá un correo
            electronico de confirmació de la reserva.
          </li>
          <li>
            Para ingresar a la sede debe presentar en la puerta su DNI/CE, y la
            del menor de edad.
          </li>
          <li>
            Menores de 14 años deben ser acompañados obligatoriamente por un
            adulto responsable.
          </li>
          <li>Llegar 10 minutos antes de la hora reservada.</li>
          <li>La tolerancia de ingreso es de máximo 30 minutos</li>
        </ol>
        <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <Title
            style={{
              textAlign: "center",
              color: "#454545",
              marginTop: "-15px",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
            }}
            level={4}
          >
            DATOS GENERALES
          </Title>
          <Form.Item
            label="Nombres"
            name="nombres"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su nombre completo!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido paterno"
            name="apellido_paterno"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su apellido paterno!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido materno"
            name="apellido_materno"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su apellido materno!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tipo de documento de identidad"
            name="tipodoc"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione un tipo de documento!",
              },
            ]}
          >
            <Select size="large" showSearch>
              <Option value="dni">DNI</Option>
              <Option value="pasaporte">Pasaporte</Option>
              <Option value="carne">Carné de extranjería</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Número de documento de identidad"
            name="nrodocumento"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese el número de su documento",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sexo"
            name="sexo"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione un sexo!",
              },
            ]}
          >
            <Select size="large" showSearch>
              <Option value="masculino">Masculino</Option>
              <Option value="femenino">Femenino</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Fecha de nacimiento"
            name="nac"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su fecha de nacimiento!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              locale={locale}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>
          <Form.Item
            label="Dirección"
            name="direccion"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su dirección!",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Distrito de residencia"
            name="distrito"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su distrito de residencia!",
              },
            ]}
          >
            <Select size="large" showSearch>
              {options}
            </Select>
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su correo electrónico!",
              },
              {
                type: "email",
                message: "Por favor,ingrese un correo electrónico válido!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Número de teléfono"
            name="phone"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su teléfono!",
              },
              {
                pattern: new RegExp("[0-9]{7,12}"),
                //pattern: new RegExp("([a-zA-Z]{3,30}\\s*)+"),
                message: "Por favor, ingrese un número de teléfono válido!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
          <Title
            style={{
              textAlign: "center",
              color: "#454545",
              marginTop: "-15px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
            level={3}
          >
            INGRESE LOS DATOS DE LOS OTROS USUARIOS QUE ASISTIRÁN A LA SEDE
          </Title>
          <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
          <Title
            style={{
              textAlign: "center",
              color: "#454545",
              marginTop: "-15px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
            level={4}
          >
            AGREGAR PERSONAS (Adultos y menores de edad según corresponda)
          </Title>

          <Form.List
            name="grupo"
            rules={[
              {
                validator: async (_, names) => {
                  console.log(min);
                  if ((!names || names.length < min - 1) && min > 1) {
                    return Promise.reject(
                      new Error(
                        "Por favor, seleccione al menos " +
                          (min - 1) +
                          " acompañante(s)."
                      )
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <div
                    style={{
                      border: "1px solid #eaeaea",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Title
                      style={{
                        textAlign: "center",
                        color: "#454545",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                      level={5}
                    >
                      Acompañante # {index + 1}
                    </Title>
                    <Form.Item
                      label="Ingrese el nombre completo"
                      name={[field.name, "nombres"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingrese su nombre completo!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Ingrese el apellido paterno"
                      name={[field.name, "apellido_paterno"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingrese su apellido paterno!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Ingrese el apellido materno"
                      name={[field.name, "apellido_materno"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingrese su apellido materno!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Ingrese el número de documento de identidad"
                      name={[field.name, "nrodocumento"]}
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor, ingrese el número de su documento",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Seleccione sexo"
                      name={[field.name, "sexo"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor, seleccione un sexo!",
                        },
                      ]}
                    >
                      <Select size="large" showSearch>
                        <Option value="masculino">Masculino</Option>
                        <Option value="femenino">Femenino</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Ingrese la fecha de nacimiento"
                      name={[field.name, "nac"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingrese su fecha de nacimiento!",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        locale={locale}
                        format={"DD/MM/YYYY"}
                      />
                    </Form.Item>
                    <Form.Item label=" ">
                      <Button
                        size="large"
                        onClick={() => {
                          remove(field.name);
                          setQuota(quota - 1);
                        }}
                        block
                        icon={<MinusCircleOutlined />}
                      >
                        Eliminar
                      </Button>
                    </Form.Item>
                  </div>
                ))}
                <Form.Item
                  extra={
                    <div>
                      <Divider
                        type="horizontal"
                        style={{ borderColor: "#2f60be44" }}
                      />
                      <p
                        style={{
                          textAlign: "justify",
                          marginLeft: "40px",
                          marginRight: "40px",
                        }}
                      >
                        Considerar lo siguiente:
                      </p>
                      <ol
                        style={{
                          textAlign: "justify",
                          marginLeft: "20px",
                          marginRight: "40px",
                        }}
                      >
                        <li>
                          Para el uso de la ciclovia la edad mínima es de 6
                          años.
                        </li>
                        <li>Uso obligatorio de casco para ciclovía.</li>
                        <li>
                          Uso obligatorio de zapatillas para la pista atlética.
                        </li>
                        <li>
                          Prohibido el uso de zapatillas de clavos en la pista
                          atlética.
                        </li>
                        <li>El aforo es limitado.</li>
                        <li>Uso obligatorio de mascarilla.</li>
                        <li>Cumplir con distanciamiento físico recomendado.</li>
                        <li>
                          Cumplir con los horarios establecidos, los cuales son
                          de una hora.
                        </li>
                        <li>Prohibido consumir alimentos dentro de la sede.</li>
                      </ol>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      console.log("max: " + max);
                      console.log("quota: " + quota);
                      if (quota < max) {
                        add();
                        setQuota(quota + 1);
                      }
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Agregar personas
                  </Button>
                </Form.Item>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>

          <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
          <Title
            style={{
              textAlign: "center",
              color: "#454545",
              marginTop: "-15px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
            level={4}
          >
            DATOS DE RESERVA
          </Title>
          <Form.Item label="Sede">
            <Select size="large" onChange={handleChangeSede} value={sede}>
              {sedes}
            </Select>
          </Form.Item>

          <Form.Item label="Actividad">
            <Select size="large" onChange={handleChangeEvent} value={event}>
              {events}
            </Select>
          </Form.Item>

          <Form.Item label="Fecha">
            <Select size="large" onChange={handleChangeDate} value={date}>
              {dates}
            </Select>
          </Form.Item>

          <Form.Item
            label="Horario"
            name="event_id"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione un horario!",
              },
            ]}
          >
            <Select size="large" value={hour} onChange={handleHourChange}>
              {hours}
            </Select>
          </Form.Item>

          <Divider type="horizontal" style={{ borderColor: "#2f60be44" }} />
          <Title
            style={{
              textAlign: "center",
              color: "#454545",
              marginTop: "-15px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
            level={4}
          >
            ACEPTACIÓN Y CONFORMIDAD
          </Title>
          <Form.Item name="acepto">
            <Checkbox
              checked={checkbox1}
              style={{ lineHeight: "32px" }}
              onChange={checkboxChange1}
            >
              Acepto los términos y condiciones para el acceso a las
              instalaciones del Proyecto Legado de los Juegos Panamericanos Lima
              2019.
            </Checkbox>
          </Form.Item>
          <Form.Item name="acepto">
            <Checkbox
              checked={checkbox2}
              style={{ lineHeight: "32px" }}
              onChange={checkboxChange2}
            >
              De conformidad con la Ley N° 29733, Ley de Protección de Datos
              Personales, doy mi consentimiento para el tratamiento de mis datos
              personales registrados, para que sean utilizados y/o tratados por
              el Proyecto Legado o a través de terceros, estricta y únicamente
              para fines relacionados a las actividades del Proyecto. Sus datos
              podrán ser incorporados en un banco de datos personales de
              titularidad de Proyecto Legado. Usted podrá ejercer sus derechos
              de información, acceso, rectificación, cancelación y oposición de
              sus datos personales, en cualquier momento.
            </Checkbox>
          </Form.Item>
          <Form.Item name="acepto">
            <Checkbox
              checked={checkbox3}
              style={{ lineHeight: "32px" }}
              onChange={checkboxChange3}
            >
              Acepto recibir noticias e información sobre eventos culturales,
              deportivos y otros relacionados al Proyecto Legado, sus
              organizadores y patrocinadores.
            </Checkbox>
          </Form.Item>
          <Form.Item name="ddjj">
            <Checkbox
              checked={checkbox4}
              style={{ lineHeight: "32px" }}
              onChange={checkboxChange4}
            >
              Declaro que no tengo ninguno de los siguientes síntomas
              relacionados a COVID-19: Fiebre, Dolor de cabeza, Tos,
              Irritabilidad, Congestión nasal, Diarrea, Dificultad para
              respirar, Falta de percepción de olor, Falta de percepción de
              sabor, y que los datos consignados aquí son verdaderos, con
              calidad de declaración jurada
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              disabled={!(checkbox1 && checkbox2 && checkbox3)}
            >
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        title="Confirmación"
        centered
        visible={modalOk}
        footer={null}
        closable={false}
      >
        <p>
          En breve le llegará un mensaje de confirmación a su correo
          electrónico. ¡Lo esperamos! Recuerde llevar su DNI y el de sus
          acompañantes para el ingreso a la Sede.
        </p>
      </Modal>
      <Modal
        title="Denegación"
        centered
        visible={modalNok}
        footer={null}
        closable={false}
      >
        <p>
          Usted ya ha registrado una reserva recientemente. Programe una reserva
          en dias posteriores.
        </p>
      </Modal>
      <Modal
        title="Alerta"
        centered
        visible={modalWarning}
        onOk={() => setModalWarning(false)}
      >
        <p>
          Si ud. presenta algún síntoma relacionado al COVID-19, no podrá
          ingresar a las sedes. Por favor, contáctese con el centro de salud más
          cercano para recibir asistencia.
        </p>
      </Modal>
    </div>
  );
}
