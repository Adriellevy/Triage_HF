import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

import ScrollableList from "../components/ScrollableList/ScrollableList.js";
import { transformDataPacientesEspera } from "../Requests/RequestsPacientes.js";
import { transformDataPacientesInternacion } from "../Requests/RequestsPacientes.js";

import AbrirIngreso from "../components/Redirecionamiento/AbrirIngresoGuiado.js";
import AbrirEstadisticas from "../components/Redirecionamiento/AbrirEstadisticas.js";
import AbrirEstaciones from "../components/Redirecionamiento/AbrirBoxes.js";
import AbrirLogin from "../components/Redirecionamiento/AbrirLoginPrimeraVez.js";
import AbrirSetings from "../components/Redirecionamiento/AbrirEdicionBoxes.js";
import EditarPaciente from "../components/EditarPaciente/EditarPaciente.js"
//estos datos ahora estan hardcodeados, pero podrian cambiar dependiendo que es lo que se solicita en el centro

const columnasEnEspera = [
  { label: "Nombre", propiedad: "nombre" },
  { label: "Edad", propiedad: "edad" },
  { label: "Gravedad", propiedad: "gravedad" },
  { label: "BOX", propiedad: "box" },
  { label: "Enfermero", propiedad: "enfermero" },
  { label: "Fecha", propiedad: "fecha" },
  { label: "Medico", propiedad: "matricula" },
  { label: "Motivo de Consulta", propiedad: "problemaPaciente" },
  { label: "Estado", propiedad: "estado" },
];
const columnasinternacion = [
  { label: "Nombre", propiedad: "nombre" },
  { label: "Edad", propiedad: "edad" },
  { label: "BOX", propiedad: "box" },
  { label: "Enfermero", propiedad: "enfermero" },
  { label: "Fecha", propiedad: "fecha" },
  { label: "Medico", propiedad: "nombreMedico" },
  { label: "Motivo de Consulta", propiedad: "problemaPaciente" },
];

const Pacientes = (props) => {
  const [nombreInput, setNombreInput] = useState("");
  const [Edad, setEdad] = useState("");
  const [Box, setBox] = useState("");
  const [Medico, setMedico] = useState("");
  const [Estado, setEstado] = useState("");

  const handleRowClick = (rowData) => {
    console.log("Fila seleccionada:", rowData);

    setNombreInput(rowData.nombre || "");
    setEdad(rowData.edad || "");
    setBox(rowData.box || "");
    setMedico(rowData.nombre || "");
    setEstado(
      rowData.estado || "ESPERA INTERNACION"
    ); /*medio hardcodeado pero util*/
  };
  /*El objetivo es obtener los pacientes en espera de ser atentidos, ahora se cargan todos los pacientes*/
  const [dataListaEnEspera, setData] = useState([]);
  useEffect(() => {
    const headersList = {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw",
      "Content-Type": "application/json",
    };
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.0.19:3000/patient", {
          method: "GET",
          headers: headersList,
        });
        const jsonData = await response.json();
        // Assuming 'transformData' is the function from the previous example
        const transformedData = transformDataPacientesEspera(jsonData);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /*El objetivo es obtener los pacientes en espera internacion*/
  const [dataListaEsperaInternacion, FijarDatos] = useState([]);
  useEffect(() => {
    const headersList = {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw",
      "Content-Type": "application/json",
    };
    const fetchData = async () => {
      try {
        {
          /*const rta = await fetch('http://localhost:3000/patient/search/awaiting-admission');*/
        }
        const rta = await fetch(
          "http://192.168.0.19:3000/patient/search/awaiting-internation",
          {
            method: "GET",
            headers: headersList,
          }
        );

        const dtajson = await rta.json();
        // Assuming 'transformData' is the function from the previous example
        const dataListaEsperaInternacion =
          transformDataPacientesInternacion(dtajson);
        FijarDatos(dataListaEsperaInternacion);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="pacientes-container">
        <Head>
          <title>exported project</title>
        </Head>
        <div className="pacientes-pacientes">
          <img
            src="/external/rectangle1895-fhs8-200h.png"
            alt="Rectangle1895"
            className="pacientes-rectangle"
          />
          <img
            src="/external/rectangle1895-qbqj-300w.png"
            alt="Rectangle1895"
            className="pacientes-rectangle1"
          />
          <img
            src="/external/rectangle1895-jmp-300w.png"
            alt="Rectangle1895"
            className="pacientes-rectangle2"
          />
          <img
            src="/external/rectangle1895-oqa8-200h.png"
            alt="Rectangle1895"
            className="pacientes-rectangle3"
          />
          <div className="pacientes-frame427319490">
            <img
              src="/external/image1895-rnb.svg"
              alt="Image1895"
              className="pacientes-image"
            />
            <span className="pacientes-text">
              <AbrirIngreso />
            </span>
          </div>
          <div className="pacientes-frame427319489">
            <img
              src="/external/vector1895-iy1q.svg"
              alt="Vector1895"
              className="pacientes-vector"
            />
            <span className="pacientes-text02">
              <span>Pacientes</span>
            </span>
          </div>
          <div className="pacientes-frame427319488">
            <img
              src="/external/graficodebarras112158-mi5n-200h.png"
              alt="graficodebarras112158"
              className="pacientes-graficodebarras11"
            />
            <span className="pacientes-text04">
              <AbrirEstadisticas />
            </span>
          </div>
          <div className="pacientes-frame427319487">
            <img
              src="/external/image1895-bu6g-200h.png"
              alt="Image1895"
              className="pacientes-image1"
            />
            <span className="pacientes-text06">
              <AbrirEstaciones />
            </span>
          </div>
          <div className="pacientes-frame427319486">
            <img
              src="/external/vector1895-yjg8.svg"
              alt="Vector1895"
              className="pacientes-vector1"
            />
            <span className="pacientes-text08">
              <AbrirLogin />
            </span>
          </div>
          <span className="pacientes-text10">
            <span>Sistema Central</span>
          </span>
          <div className="pacientes-frame427319484">
            <img
              src="/external/image1895-bg59.svg"
              alt="Image1895"
              className="pacientes-image2"
            />
            <span className="pacientes-text12">
              <AbrirSetings />
            </span>
          </div>
          <img
            src="/external/rectangule1904-emmu-300h.png"
            alt="Rectangule1904"
            className="pacientes-rectangule"
          />
          <span className="pacientes-rectangules">
            {dataListaEsperaInternacion && (
              <ScrollableList
                data={dataListaEsperaInternacion}
                columns={columnasinternacion}
                onRowClick={handleRowClick}
              />
            )}
          </span>
          <span className="pacientes-text14">
            <span>Pacientes espera de internacion</span>
          </span>
          <img
            src="/external/rectangule1919-b4cl-300h.png"
            alt="Rectangule1919"
            className="pacientes-rectangule1"
          />
          <span className="pacientes-text16">
            <span>Pacientes con menos de 3 minutos de espera</span>
          </span>
          <img
            src="/external/rectangule1964-mr7f-300h.png"
            alt="Rectangule1964"
            className="pacientes-rectangule2"
          />
          <span className="pacientes-rectangules2">
            {dataListaEnEspera && (
              <ScrollableList
                data={dataListaEnEspera}
                columns={columnasEnEspera}
                onRowClick={handleRowClick}
              />
            )}
          </span>
          <span className="pacientes-text18">
            <span>Lista pacientes </span>
          </span>
          <div className="Contenedor modificar paciente">
            <img
              src="/external/image1964-dpc-200h.png"
              alt="Image1964"
              className="pacientes-image3"
            />
            <span className="pacientes-text20">
              <span>Modificar paciente</span>
            </span>
            <input
              id="Nombre y apellido"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              alt="TextBox2181"
              className="pacientes-text-box"
            />
            <span className="pacientes-text22">
              <span>Nombre y Apellido</span>
            </span>
            <input
              className="pacientes-text-box4"
              id="Edad"
              value={Edad}
              onChange={(e) => setEdad(e.target.value)}
            />

            <span className="pacientes-text24">
              <span>Edad</span>
            </span>
            <input
              id="Box"
              value={Box}
              onChange={(e) => setBox(e.target.value)}
              alt="TextBox2181"
              className="pacientes-text-box1"
            />
            <span className="pacientes-text26">
              <span>BOX</span>
            </span>
            <input
              id="Medico"
              value={Medico}
              onChange={(e) => setMedico(e.target.value)}
              src="/external/textbox2181-4iep-200h.png"
              alt="TextBox2181"
              className="pacientes-text-box2"
            />
            <span className="pacientes-text28">
              <span>Medico</span>
            </span>
            <input
              id="Estado"
              value={Estado}
              onChange={(e) => setEstado(e.target.value)}
              alt="TextBox2181"
              className="pacientes-text-box3"
            />
            <span className="pacientes-text30">
              <span>
                <span>Estado</span>
                <br></br>
                <span></span>
              </span>
            </span>

            <span  className="MandarModificacion">
              <EditarPaciente></EditarPaciente>
            </span>
          </div>
        </div>
      </div>
      {/*Login de enfermero*/}
      <div className="pacientes-frame427319476">
        <img
          src="/external/ellipse12631-lrk-200h.png"
          alt="Ellipse12631"
          className="pacientes-ellipse1"
        />
        <span className="pacientes-text35">
          <span>Buen Día, Enfermero Ian</span>
        </span>
        <span className="pacientes-text37">
          <span>Matricule id : 2015978</span>
        </span>
        <img
          src="/external/vector2631-npi.svg"
          alt="Vector2631"
          className="pacientes-vector2"
        />
      </div>
      <style jsx>
        {`
          .MandarModificacion {
            display: flex;
            overflow: hidden;
            position: absolute;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background-color: rgba(55, 179, 226, 1);
            z-index: 1;
            height: auto;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            font-family: Montserrat;
            color: white;
            left: 58%;
            bottom: 3%;
            transform: translate(-50%, 0);
          }

          .pacientes-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .pacientes-pacientes {
            width: 100%;
            height: 734px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 30px 0 0 30px;
            background-color: rgba(240, 240, 240, 1);
          }
          .pacientes-rectangle {
            top: 247px;
            left: 0px;
            width: 224px;
            height: 92px;
            position: absolute;
          }
          .pacientes-rectangle1 {
            top: 312px;
            left: 0px;
            width: 250px;
            height: 422px;
            position: absolute;
            border-radius: 0 30px 30px;
          }
          .pacientes-rectangle2 {
            top: 0px;
            left: 0px;
            width: 250px;
            height: 252px;
            position: absolute;
            border-radius: 0 30px 30px 0;
          }
          .pacientes-rectangle3 {
            top: 252px;
            left: 41px;
            width: 209px;
            height: 60px;
            position: absolute;
            border-radius: 30px;
          }
          .pacientes-frame427319490 {
            gap: 24px;
            top: 152px;
            left: 64px;
            width: 168px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .pacientes-image {
            width: 20px;
            height: 17px;
          }
          .pacientes-text {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319489 {
            gap: 24px;
            top: 272px;
            left: 64px;
            width: 124px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .pacientes-vector {
            width: 20px;
            height: 18px;
          }
          .pacientes-text02 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319488 {
            gap: 26px;
            top: 332px;
            left: 63px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
          }
          .pacientes-graficodebarras11 {
            width: 19px;
            height: 19px;
          }
          .pacientes-text04 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319487 {
            gap: 25px;
            top: 212px;
            left: 64px;
            width: 124px;
            display: flex;
            position: absolute;
            align-items: flex-start;
          }
          .pacientes-image1 {
            width: 19px;
            height: 19px;
          }
          .pacientes-text06 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319486 {
            gap: 32px;
            top: 687px;
            left: 74px;
            width: 103px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .pacientes-vector1 {
            width: 12px;
            height: 17px;
          }
          .pacientes-text08 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text10 {
            top: 20px;
            left: 28px;
            color: rgba(255, 255, 255, 1);
            width: 178px;
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319484 {
            gap: 28px;
            top: 393px;
            left: 64.60888671875px;
            width: 111px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .pacientes-image2 {
            width: 15px;
            height: 14px;
          }
          .pacientes-text12 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-rectangule {
            top: 138px;
            left: 290px;
            width: 514px;
            height: 201px;
            position: absolute;
            border-radius: 30px;
          }
          .pacientes-rectangules {
            top: 170px;
            left: 305px;
            width: 500px;
            height: 150px;
            position: absolute;
            border-radius: 30px;
          }
          .pacientes-text14 {
            top: 149px;
            left: 413px;
            color: rgba(0, 0, 0, 1);
            width: 267px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-rectangule1 {
            top: 138px;
            left: 818px;
            width: 443px;
            height: 201px;
            position: absolute;
            border-radius: 30px;
          }

          .pacientes-text16 {
            top: 148px;
            left: 851px;
            color: rgba(0, 0, 0, 1);
            width: 378px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }

          .pacientes-rectangule2 {
            top: 48.5%;
            left: 22%;
            width: 74%;
            height: 29.12%;
            border-radius: 3.75%;
            position: absolute;
          }
          .pacientes-rectangules2 {
            top: 54.5%;
            left: 22.5%;
            width: 74%;
            height: 29.12%;
            border-radius: 3.75%;
            position: absolute;
          }

          .pacientes-text18 {
            top: 375px;
            left: 712px;
            color: rgba(0, 0, 0, 1);
            width: 127px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-image3 {
            top: 598px;
            left: 290px;
            width: 971px;
            height: 118px;
            position: absolute;
            border-radius: 30px;
          }
          .pacientes-text20 {
            top: 613px;
            left: 695px;
            color: rgba(0, 0, 0, 1);
            width: 161px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-image4 {
            top: 662px;
            left: 520px;
            width: 142px;
            height: 21px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(243, 243, 243, 1);
          }
          .pacientes-image5 {
            top: 16px;
            left: 133px;
            width: 10px;
            height: 10px;
            position: absolute;
          }
          .pacientes-text-box {
            top: 661px;
            left: 339px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #f3f3f3;
            text-align: center;
          }
          .pacientes-text22 {
            top: 637px;
            left: 334px;
            color: rgba(0, 0, 0, 1);
            width: 152px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text24 {
            top: 637px;
            left: 497px;
            color: rgba(0, 0, 0, 1);
            width: 148px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: Medium;
            text-align: center;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text-box1 {
            top: 661px;
            left: 700px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #f3f3f3;
            text-align: center;
          }
          .pacientes-text26 {
            top: 639px;
            left: 751px;
            color: rgba(0, 0, 0, 1);
            width: 40px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text-box2 {
            top: 662px;
            left: 881px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #f3f3f3;
            text-align: center;
          }
          .pacientes-text28 {
            top: 637px;
            left: 920px;
            color: rgba(0, 0, 0, 1);
            width: 127px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text-box3 {
            top: 662px;
            left: 1063px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #f3f3f3;
            text-align: center;
          }
          .pacientes-text-box4 {
            top: 662px;
            left: 510px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #f3f3f3;
            text-align: center;
          }
          .pacientes-text30 {
            top: 637px;
            left: 1071px;
            color: rgba(0, 0, 0, 1);
            width: 126px;
            height: auto;
            position: absolute;
            font-size: 16px;
            font-style: Medium;
            text-align: center;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-frame427319476 {
            gap: 16px;
            top: 32px;
            left: 269px;
            width: 350px;
            display: flex;
            position: absolute;
            flex-wrap: wrap;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .pacientes-ellipse1 {
            width: 56px;
            height: 56px;
          }
          .pacientes-text35 {
            color: rgba(0, 0, 0, 1);
            width: 278px;
            height: auto;
            z-index: 1;
            font-size: 20px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-text37 {
            color: rgba(165, 165, 165, 1);
            width: 172px;
            height: auto;
            z-index: 0;
            font-size: 14px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .pacientes-vector2 {
            top: 10.743379592895508px;
            left: 328.6494140625px;
            width: 16px;
            height: 5px;
            z-index: 3;
            position: absolute;
          }
        `}
      </style>
    </>
  );
};

export default Pacientes;
