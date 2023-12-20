import React, { useEffect,useState} from 'react'
import Head from 'next/head'

import ScrollableList from '../components/ScrollableList/ScrollableList.js';

import AbrirIngreso from '../components/Redirecionamiento/AbrirIngresoGuiado.js';
import AbrirEstadisticas from '../components/Redirecionamiento/AbrirEstadisticas.js';
import AbrirLogin from '../components/Redirecionamiento/AbrirLoginPrimeraVez.js';
import AbrirSetings from '../components/Redirecionamiento/AbrirEdicionBoxes.js'; 
import AbrirPacientes from '../components/Redirecionamiento/AbrirPacientes.js'; 


import { transformDataBoxes } from '../Requests/RequestsPacientes.js';

const Columnas_Boxes = [
  { label: 'Box', propiedad: 'box_id' },
  { label: 'Tipo', propiedad: 'box_type' }]
/*El objetivo es obtener los pacientes en espera de ser atentidos, ahora se cargan todos los pacientes*/

const Estacionescotidianediad = (props) => {

  const [dataListaEnEspera, setData] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/box');
      const jsonData = await response.json();
      const transformedData = transformDataBoxes(jsonData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  return (
    <>
      <div className="estacionescotidianediad-container">
        <Head>
          <title>exported project</title>
        </Head>
        <div className="estacionescotidianediad-estacionescotidianediad">
          <span className="estacionescotidianediad-text">
            <span>en sala de espera</span>
          </span>
          <img
            src="/external/vector1917-n0lf.svg"
            alt="Vector1917"
            className="estacionescotidianediad-vector"
          />
          <span className="estacionescotidianediad-text02">
            <AbrirLogin/>
          </span>
          <img
            src="/external/rectangle1917-511p-200h.png"
            alt="Rectangle1917"
            className="estacionescotidianediad-rectangle"
          />
          <img
            src="/external/rectangle1917-3p4-700h.png"
            alt="Rectangle1917"
            className="estacionescotidianediad-rectangle1"
          />
          <img
            src="/external/rectangle1918-0nh-300w.png"
            alt="Rectangle1918"
            className="estacionescotidianediad-rectangle2"
          />
          <img
            src="/external/rectangle1918-t3jh-200h.png"
            alt="Rectangle1918"
            className="estacionescotidianediad-rectangle3"
          />
          <div className="estacionescotidianediad-frame427319483">
            <img
              src="/external/vector1918-ged6.svg"
              alt="Vector1918"
              className="estacionescotidianediad-vector1"
            />
            <span className="estacionescotidianediad-text04">
              <AbrirPacientes/>
            </span>
          </div>
          <div className="estacionescotidianediad-image"></div>
          <div className="estacionescotidianediad-frame427319482">
            <span className="estacionescotidianediad-text06">
              <AbrirEstadisticas/>
            </span>
            <img
              src="/external/graficodebarras112158-vc2k-200h.png"
              alt="graficodebarras112158"
              className="estacionescotidianediad-graficodebarras11"
            />
          </div>
          <div className="estacionescotidianediad-frame427319481">
            <span className="estacionescotidianediad-text08">
              <span>Estaciones</span>
            </span>
            <img
              src="/external/carpamedica211919-kz7w-200w.png"
              alt="carpamedica211919"
              className="estacionescotidianediad-carpamedica21"
            />
          </div>
          <div className="estacionescotidianediad-frame427319480">
            <img
              src="/external/vector1911-2k3.svg"
              alt="Vector1911"
              className="estacionescotidianediad-vector2"
            />
            <span className="estacionescotidianediad-text10">
              <AbrirLogin/> {/*TODO borrar cookies */}
            </span>
          </div>
          <span className="estacionescotidianediad-text12">
            <span>Sistema Central</span>
          </span>
          <div className="estacionescotidianediad-frame427319479">
            <img
              src="/external/rectangle461911-olke-200h.png"
              alt="Rectangle461911"
              className="estacionescotidianediad-rectangle46"
            />
            <span className="estacionescotidianediad-text14">
              <AbrirIngreso/>
            </span>
            <img
              src="/external/image1911-63ck.svg"
              alt="Image1911"
              className="estacionescotidianediad-image1"
            />
          </div>
          <img
            src="/external/rectangule1911-kq2r-600h.png"
            alt="Rectangule1911"
            className="estacionescotidianediad-rectangule"
          />
          {/*TODO hacer lista despligue BOXES*/}
          <span className="estacionescotidianediad-rectangule">
          <ScrollableList className="" data={dataListaEnEspera} columns={Columnas_Boxes}/>
          </span>
          <div className="estacionescotidianediad-frame427319478">
            <img
              src="/external/image2158-6ehj.svg"
              alt="Image2158"
              className="estacionescotidianediad-image2"
            />
            <img
              src="/external/rectangle462158-iq9d-200h.png"
              alt="Rectangle462158"
              className="estacionescotidianediad-rectangle461"
            />
            <img
              src="/external/rectangle452158-0pp-200h.png"
              alt="Rectangle452158"
              className="estacionescotidianediad-rectangle45"
            />
            <span className="estacionescotidianediad-text37">
              <AbrirSetings/>
            </span>
          </div>
          <div className="estacionescotidianediad-frame427319476">
            <img
              src="/external/ellipse12631-rsl9-200h.png"
              alt="Ellipse12631"
              className="estacionescotidianediad-ellipse1"
            />
            <span className="estacionescotidianediad-text39">
              <span>Buen Día, Enfermero Ian</span>
            </span>
            <span className="estacionescotidianediad-text41">
              <span>Matricule id : 2015978</span>
            </span>
            <img
              src="/external/vector2631-6ud9.svg"
              alt="Vector2631"
              className="estacionescotidianediad-vector3"
            />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .estacionescotidianediad-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .estacionescotidianediad-estacionescotidianediad {
            width: 100%;
            height: 720px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            background-color: rgba(240, 240, 240, 1);
          }
          .estacionescotidianediad-text {
            top: 852px;
            left: 606px;
            color: rgba(0, 0, 0, 1);
            width: 257px;
            height: auto;
            position: absolute;
            font-size: 24px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .estacionescotidianediad-vector {
            top: 676.89990234375px;
            left: 64px;
            width: 12px;
            height: 16px;
            position: absolute;
          }
          .estacionescotidianediad-text02 {
            top: 675px;
            left: 108px;
            color: rgba(255, 255, 255, 1);
            width: 59px;
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
          .estacionescotidianediad-rectangle {
            top: 112px;
            left: 0px;
            width: 224px;
            height: 143px;
            position: absolute;
          }
          .estacionescotidianediad-rectangle1 {
            top: 252px;
            left: 0px;
            width: 250px;
            height: 648px;
            position: absolute;
            border-radius: 0 30px 30px;
          }
          .estacionescotidianediad-rectangle2 {
            top: 0px;
            left: 0px;
            width: 250px;
            height: 192px;
            position: absolute;
            border-radius: 0 30px 30px 0;
          }
          .estacionescotidianediad-rectangle3 {
            top: 192px;
            left: 41px;
            width: 209px;
            height: 60px;
            position: absolute;
            border-radius: 30px;
          }
          .estacionescotidianediad-frame427319483 {
            gap: 24px;
            top: 272px;
            left: 64px;
            width: 124px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .estacionescotidianediad-vector1 {
            width: 20px;
            height: 18px;
          }
          .estacionescotidianediad-text04 {
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
          .estacionescotidianediad-image {
            top: 333px;
            left: 64px;
            width: 18px;
            height: 17px;
            display: flex;
            overflow: hidden;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .estacionescotidianediad-frame427319482 {
            gap: 10px;
            top: 328px;
            left: 64px;
            width: 158px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .estacionescotidianediad-text06 {
            top: 4px;
            left: 44px;
            color: rgba(255, 255, 255, 1);
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
          .estacionescotidianediad-graficodebarras11 {
            top: 4px;
            left: 0px;
            width: 19px;
            height: 19px;
            z-index: 1;
            position: absolute;
          }
          .estacionescotidianediad-frame427319481 {
            gap: 10px;
            top: 212px;
            left: 64px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .estacionescotidianediad-text08 {
            left: 44px;
            color: rgba(0, 0, 0, 1);
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
          .estacionescotidianediad-carpamedica21 {
            top: 0px;
            left: 1px;
            width: 18px;
            height: 19px;
            z-index: 1;
            position: absolute;
          }
          .estacionescotidianediad-frame427319480 {
            gap: 32px;
            top: 675px;
            left: 64px;
            width: 103px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .estacionescotidianediad-vector2 {
            width: 12px;
            height: 16px;
          }
          .estacionescotidianediad-text10 {
            color: rgba(255, 255, 255, 1);
            width: 59px;
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
          .estacionescotidianediad-text12 {
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
          .estacionescotidianediad-frame427319479 {
            gap: 10px;
            top: 155px;
            left: 64px;
            width: 168px;
            display: flex;
            overflow: hidden;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-rectangle46 {
            width: 168px;
            height: 20px;
          }
          .estacionescotidianediad-text14 {
            left: 44px;
            color: rgba(255, 255, 255, 1);
            height: auto;
            z-index: 1;
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
          .estacionescotidianediad-image1 {
            top: 2px;
            left: 0px;
            width: 20px;
            height: 17px;
            z-index: 2;
            position: absolute;
          }
          .estacionescotidianediad-rectangule {
            top: 126px;
            left: 269px;
            width: 971px;
            height: 551px;
            position: absolute;
            border-radius: 30px;
          }
          .estacionescotidianediad-table {
            top: 183px;
            left: 284px;
            width: 956px;
            height: 489px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 0;
            justify-content: center;
          }
          .estacionescotidianediad-col1labels {
            display: flex;
            overflow: hidden;
            flex-grow: 1;
            align-self: stretch;
            align-items: flex-start;
            flex-direction: column;
          }
          .estacionescotidianediad-frame427319458 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text16 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row1 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text18 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row2 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text19 {
            color: rgba(0, 0, 0, 1);
            width: 174px;
            height: auto;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row3 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text20 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row4 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text21 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row5 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text22 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row6 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text23 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-row7 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
          }
          .estacionescotidianediad-text24 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            flex-grow: 1;
            text-align: left;
            line-height: 129.99999523162842%;
          }
          .estacionescotidianediad-col2 {
            display: flex;
            overflow: hidden;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .estacionescotidianediad-logo1 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text25 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row11 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check01 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check02 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row21 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row31 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check03 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check04 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check05 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row41 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row51 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row61 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check06 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check07 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check08 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row71 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-col3 {
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .estacionescotidianediad-logo2 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text27 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row12 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check09 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check10 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check11 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row22 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row32 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check12 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check13 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check14 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row42 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check15 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check16 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check17 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row52 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row62 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row72 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-col4 {
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .estacionescotidianediad-logo3 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text29 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row13 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check18 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check19 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check20 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row23 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check21 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check22 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check23 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row33 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check24 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check25 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check26 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row43 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row53 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row63 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check27 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check28 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check29 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row73 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check30 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check31 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check32 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-col5 {
            display: flex;
            overflow: hidden;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .estacionescotidianediad-logo4 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text31 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row14 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check33 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check34 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check35 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row24 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row34 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check36 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check37 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check38 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row44 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-row54 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check39 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check40 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check41 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row64 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check42 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check43 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check44 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row74 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check45 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(55, 179, 226, 1);
          }
          .estacionescotidianediad-check46 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check47 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-col6highlight {
            display: flex;
            overflow: hidden;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
            background-color: rgba(65, 65, 73, 0.25);
          }
          .estacionescotidianediad-yourlogo {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
            background-color: rgba(65, 65, 73, 0.20000000298023224);
          }
          .estacionescotidianediad-text33 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            text-align: left;
            line-height: 120.00000476837158%;
          }
          .estacionescotidianediad-row15 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check48 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check49 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check50 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row25 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check51 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check52 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check53 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row35 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check54 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check55 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check56 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row45 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check57 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check58 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check59 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row55 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check60 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check61 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check62 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row65 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check63 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check64 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check65 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-row75 {
            gap: 8px;
            display: flex;
            padding: 8px 32px;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            border-color: rgba(65, 65, 73, 1);
            border-style: solid;
            border-width: 0 0 1px;
            justify-content: center;
          }
          .estacionescotidianediad-check66 {
            width: 36px;
            height: 36px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            border-radius: 999px;
            background-color: rgba(123, 134, 232, 1);
          }
          .estacionescotidianediad-check67 {
            top: 4.271484375px;
            left: 4.09619140625px;
            width: 24px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
            background-color: rgba(217, 217, 217, 1);
          }
          .estacionescotidianediad-check68 {
            top: 7.255810260772705px;
            left: 4.843273639678955px;
            width: 18px;
            height: 14px;
            position: absolute;
          }
          .estacionescotidianediad-text35 {
            top: 138px;
            left: 691px;
            color: rgba(0, 0, 0, 1);
            width: 111px;
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
          .estacionescotidianediad-frame427319478 {
            top: 393px;
            left: 65.609375px;
            width: 181px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .estacionescotidianediad-image2 {
            width: 15px;
            height: 14px;
          }
          .estacionescotidianediad-rectangle461 {
            width: 166px;
            height: 31px;
            z-index: 1;
          }
          .estacionescotidianediad-rectangle45 {
            top: 3px;
            left: 26.390625px;
            width: 101px;
            height: 20px;
            z-index: 2;
            position: absolute;
            border-radius: 43px;
          }
          .estacionescotidianediad-text37 {
            left: 42.390625px;
            color: rgba(255, 255, 255, 1);
            height: auto;
            z-index: 3;
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
          .estacionescotidianediad-frame427319476 {
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
          .estacionescotidianediad-ellipse1 {
            width: 56px;
            height: 56px;
          }
          .estacionescotidianediad-text39 {
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
          .estacionescotidianediad-text41 {
            color: rgba(165, 165, 165, 1);
            width: 172px;
            height: auto;
            z-index: 2;
            font-size: 14px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .estacionescotidianediad-vector3 {
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
  )
}

export default Estacionescotidianediad
