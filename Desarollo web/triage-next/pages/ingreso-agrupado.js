import React from 'react'
import Head from 'next/head'
import DateDropdown from '../components/DateWidget/dateDropdown';
import SelectDinamico from '../components/SelectDinamico/SelectDinamico.js'

import AbrirEstaciones from '../components/Redirecionamiento/AbrirBoxes.js';
import AbrirEstadisticas from '../components/Redirecionamiento/AbrirEstadisticas.js';
import AbrirLogin from '../components/Redirecionamiento/AbrirLoginPrimeraVez.js';
import AbrirSetings from '../components/Redirecionamiento/AbrirEdicionBoxes.js'; 
import AbrirPacientes from '../components/Redirecionamiento/AbrirPacientes.js'; 

//import TextBox from '../components/TextBox/TextBox.js'; no logre hacer que funcione chequear
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const getSelectedDate = () => {
  const selectedDay = document.getElementById('day').value;
  const selectedMonth = document.getElementById('month').value;
  const selectedYear = document.getElementById('year').value;

  alert(`Selected Date: ${selectedMonth}/${selectedDay}/${selectedYear}`);
  /* en vez de hacer el alert hacer que tome todos los datos y enviarlos al server*/
};

const IngresoAgrupado = (props) => {
  return (
    <>
      <div className="ingreso-agrupado-container">
        <Head>
          <title>exported project</title>
        </Head>
        <div className="ingreso-agrupado-ingreso-agrupado">
          <div className="ingreso-agrupado-image">
            <img
              src="/external/ellipse11859-pfsn-200h.png"
              alt="Ellipse11859"
              className="ingreso-agrupado-ellipse1"
            />
            <div className="ingreso-agrupado-group10">
              <span className="ingreso-agrupado-text">
                <span>Matricule id : 2015978</span>
              </span>
              <div className="ingreso-agrupado-group9">
                <span className="ingreso-agrupado-text02">
                  <span>Buen Día, Enfermero Ian</span>
                </span>
                <img
                  src="/external/frame1851-2fm.svg"
                  alt="Frame1851"
                  className="ingreso-agrupado-frame"
                />
              </div>
            </div>
          </div>
          <img
            src="/external/image1851-gil-300h.png"
            alt="Image1851"
            className="ingreso-agrupado-image01"
          />
          <span className="ingreso-agrupado-text04">
            <span>Ingreso Personificado</span>
          </span>
          <input
            src="/external/textbox1851-x0i-200h.png"
            alt="TextBox1851"
            className="ingreso-agrupado-text-box"
          />
          <span className="ingreso-agrupado-text06">
            <span>Motivo de Consulta</span>
          </span>
          <span className="ingreso-agrupado-text08">
            <span>Dolor</span>
          </span>
          <input
            className="ingreso-agrupado-text-box01"
          />
          <span className="ingreso-agrupado-text10">
            <span>Medicacion Habital</span>
          </span>
          <span className="ingreso-agrupado-text12">
            <span>en sala de espera</span>
          </span>
          <div className="ingreso-agrupado-frame427319469">
            <img
              src="/external/vector1851-llj.svg"
              alt="Vector1851"
              className="ingreso-agrupado-vector"
            />
            <span className="ingreso-agrupado-text14">
              {/*Aca estaba un login raro*/}
            </span>
          </div>
          <img
            src="/external/rectangle1851-l1wj-200h.png"
            alt="Rectangle1851"
            className="ingreso-agrupado-rectangle"
          />
          <img
            src="/external/rectangle1851-4k2-800h.png"
            alt="Rectangle1851"
            className="ingreso-agrupado-rectangle1"
          />
          <img
            src="/external/rectangle1851-l9y-200h.png"
            alt="Rectangle1851"
            className="ingreso-agrupado-rectangle2"
          />
          <img
            src="/external/rectangle1851-7xab-200h.png"
            alt="Rectangle1851"
            className="ingreso-agrupado-rectangle3"
          />
          <div className="ingreso-agrupado-frame427319468">
            <img
              src="/external/image1851-ismu.svg"
              alt="Image1851"
              className="ingreso-agrupado-image02"
            />
            <span className="ingreso-agrupado-text16">
              <span>Ingreso Guiado</span>
            </span>
          </div>
          <div className="ingreso-agrupado-frame427319467">
            <img
              src="/external/image1851-a69.svg"
              alt="Image1851"
              className="ingreso-agrupado-image03"
            />
            <span className="ingreso-agrupado-text18">
              <AbrirPacientes/>
            </span>
          </div>
          <div className="ingreso-agrupado-image04"></div>
          <div className="ingreso-agrupado-frame427319466">
            <img
              src="/external/graficodebarras112158-puvu-200h.png"
              alt="graficodebarras112158"
              className="ingreso-agrupado-graficodebarras11"
            />
            <img
              src="/external/button1851-2f9j-200h.png"
              alt="Button1851"
              className="ingreso-agrupado-button"
            />
            <span className="ingreso-agrupado-text20">
              <AbrirEstadisticas/>
            </span>
          </div>
          <div className="ingreso-agrupado-frame427319465">
            <img
              src="/external/image1851-7ql6-200h.png"
              alt="Image1851"
              className="ingreso-agrupado-image05"
            />
            <img
              src="/external/rectangle451851-84v-200h.png"
              alt="Rectangle451851"
              className="ingreso-agrupado-rectangle45"
            />
            <span className="ingreso-agrupado-text22">
              <AbrirEstaciones/>
            </span>
          </div>
          <div className="ingreso-agrupado-frame427319464">
            <img
              src="/external/vector1851-d5da.svg"
              alt="Vector1851"
              className="ingreso-agrupado-vector1"
            />
            <span className="ingreso-agrupado-text24">
              <AbrirLogin/>
            </span>
          </div>
          <span className="ingreso-agrupado-text26">
            <span>Sistema Central</span>
          </span>
          <img
            src="/external/image1851-ltzq-200h.png"
            alt="Image1851"
            className="ingreso-agrupado-image06"
          />
          <img
            src="/external/button1851-had2-200h.png"
            alt="Button1851"
            className="ingreso-agrupado-button1"
          />
          <span className="ingreso-agrupado-text28">
            <span>Nuevo Ingreso</span>
          </span>
          <div className="ingreso-agrupado-frame427319463">
            <select className='ingreso-agrupado-text-box02' id="frutas">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
          </div>
          <span className="ingreso-agrupado-text30">
            <span>Hace cuanto</span>
          </span>
          <div className="ingreso-agrupado-frame427319462">
          <select className='ingreso-agrupado-text-box03' id="frutas">
                <option value="1">&lt; 24hrs</option>
                <option value="2">&gt; 24hrs y &lt; 72hrs</option>
                <option value="3">&gt; 72hrs</option>
            </select>
          </div>
          <div className="ingreso-agrupado-frame427319461">
          <form>
            <DateDropdown id="day" options={days} />
            <DateDropdown id="month" options={months} />
            <DateDropdown id="year" options={years} />
          </form>
          </div>
          <img
            src="/external/rectangule1851-szda-200h.png"
            alt="Rectangule1851"
            className="ingreso-agrupado-rectangule"
          />
          <input
            src="/external/textbox1851-8ri-200h.png"
            alt="TextBox1851"
            className="ingreso-agrupado-text-box05"
          />
          <input
            src="/external/textbox1851-p0cc-200h.png"
            alt="TextBox1851"
            className="ingreso-agrupado-text-box06"
          />
          <input
            src="/external/textbox1851-414-200h.png"
            alt="TextBox1851"
            className="ingreso-agrupado-text-box07"
          />
          <span className="ingreso-agrupado-text32">
            <span>Fecha Nacimiento</span>
          </span>
          <span className="ingreso-agrupado-text34">
            <span>Nombre y Apellido</span>
          </span>
          <span className="ingreso-agrupado-text36">
            <span>Numero de historial</span>
          </span>
          <img
            src="/external/image1851-a2i7-200h.png"
            alt="Image1851"
            className="ingreso-agrupado-image10"
          />
          <img
            src="/external/button1851-zwvl-200h.png"
            alt="Button1851"
            className="ingreso-agrupado-button2"
          />
          <span className="ingreso-agrupado-text38">
            <span>Buscar Historial</span>
          </span>
          <div className="ingreso-agrupado-frame427319460">
            <span className="ingreso-agrupado-text40">
              <span onClick={getSelectedDate}>Triage</span>
            </span>
          </div>
          <input
            src="/external/textbox1861-fhjz-200h.png"
            alt="TextBox1861"
            className="ingreso-agrupado-text-box08"
          />
          <span className="ingreso-agrupado-text42">
            <span>Nombre y Apellido</span>
          </span>
          <span className="ingreso-agrupado-text44">
            <span>Fecha nacimiento</span>
          </span>
          <input
            src="/external/textbox1861-ewaf-200h.png"
            alt="TextBox1861"
            className="ingreso-agrupado-text-box09"
          />
          <span className="ingreso-agrupado-text46">
            <span>BOX</span>
          </span>
          <input
            src="/external/textbox1862-85s5-200h.png"
            alt="TextBox1862"
            className="ingreso-agrupado-text-box10"
          />
          <span className="ingreso-agrupado-text48">
            <span>Triage</span>
          </span>
          <input
            src="/external/textbox1953-n5m7-200h.png"
            alt="TextBox1953"
            className="ingreso-agrupado-text-box11"
          />
          <span className="ingreso-agrupado-text50">
            <span>Equipo Medico</span>
          </span>
          <input
            src="/external/textbox1953-n5m7-200h.png"
            alt="TextBox1953"
            className="ingreso-agrupado-text-box12"
          />
          <span className="ingreso-agrupado-text51">
            <span>Equipo Enfermero</span>
          </span>
          <div className="ingreso-agrupado-frame427319459">
            <img
              src="/external/image2158-bhfl.svg"
              alt="Image2158"
              className="ingreso-agrupado-image11"
            />
            <img
              src="/external/rectangle462158-z3ip-200h.png"
              alt="Rectangle462158"
              className="ingreso-agrupado-rectangle46"
            />
            <img
              src="/external/button2158-ht8j-200h.png"
              alt="Button2158"
              className="ingreso-agrupado-button3"
            />
            <span className="ingreso-agrupado-text52">
              <AbrirSetings/>
            </span>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .ingreso-agrupado-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .ingreso-agrupado-ingreso-agrupado {
            width: 100%;
            height: 720px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            background-color: rgba(240, 240, 240, 1);
          }
          .ingreso-agrupado-image {
            top: 32px;
            left: 269px;
            width: 350px;
            height: 56px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .ingreso-agrupado-ellipse1 {
            top: 0px;
            left: 0px;
            width: 56px;
            height: 56px;
            position: absolute;
          }
          .ingreso-agrupado-group10 {
            top: 6px;
            left: 72px;
            width: 278px;
            height: 45px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .ingreso-agrupado-text {
            top: 28px;
            color: rgba(165, 165, 165, 1);
            width: 172px;
            height: auto;
            position: absolute;
            font-size: 14px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .ingreso-agrupado-group9 {
            top: 0px;
            left: 0px;
            width: 278px;
            height: 24px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .ingreso-agrupado-text02 {
            color: rgba(0, 0, 0, 1);
            width: 278px;
            height: auto;
            position: absolute;
            font-size: 20px;
            font-style: Medium;
            text-align: left;
            font-family: Montserrat;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .ingreso-agrupado-frame {
            top: 0px;
            left: 251.3118896484375px;
            width: 27px;
            height: 24px;
            position: absolute;
          }
          .ingreso-agrupado-image01 {
            top: 124px;
            left: 297px;
            width: 925px;
            height: 269px;
            position: absolute;
            border-radius: 30px;
          }
          .ingreso-agrupado-text04 {
            top: 130px;
            left: 667px;
            color: rgba(0, 0, 0, 1);
            width: 180px;
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
          .ingreso-agrupado-text-box {
            top: 183px;
            left: 318px;
            width: 323px;
            height: 45px;
            position: absolute;
            border-radius: 15px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text06 {
            top: 163px;
            left: 402px;
            color: rgba(0, 0, 0, 1);
            width: 171px;
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
          .ingreso-agrupado-text08 {
            top: 185px;
            left: 729px;
            color: rgba(0, 0, 0, 1);
            width: 47px;
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
          .ingreso-agrupado-text-box01 {
            top: 273px;
            left: 318px;
            width: 323px;
            height: 44px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text10 {
            top: 253px;
            left: 399px;
            color: rgba(0, 0, 0, 1);
            width: 162px;
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
          .ingreso-agrupado-text12 {
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
          .ingreso-agrupado-frame427319469 {
            gap: 32px;
            top: 675px;
            left: 64px;
            width: 103px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .ingreso-agrupado-vector {
            width: 12px;
            height: 16px;
          }
          .ingreso-agrupado-text14 {
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
          .ingreso-agrupado-rectangle {
            top: 112px;
            left: 0px;
            width: 224px;
            height: 92px;
            position: absolute;
          }
          .ingreso-agrupado-rectangle1 {
            top: 193px;
            left: 0px;
            width: 250px;
            height: 707px;
            position: absolute;
            border-radius: 0 30px 30px;
          }
          .ingreso-agrupado-rectangle2 {
            top: 0px;
            left: 0px;
            width: 250px;
            height: 132px;
            position: absolute;
            border-radius: 0 30px 30px 0;
          }
          .ingreso-agrupado-rectangle3 {
            top: 133px;
            left: 41px;
            width: 209px;
            height: 60px;
            position: absolute;
            border-radius: 30px;
          }
          .ingreso-agrupado-frame427319468 {
            gap: 24px;
            top: 152px;
            left: 64px;
            width: 168px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .ingreso-agrupado-image02 {
            width: 20px;
            height: 17px;
          }
          .ingreso-agrupado-text16 {
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
          .ingreso-agrupado-frame427319467 {
            gap: 24px;
            top: 272px;
            left: 56px;
            width: 130px;
            display: flex;
            padding: 0 3px;
            overflow: hidden;
            position: absolute;
            align-items: center;
            background-color: rgba(55, 179, 226, 1);
          }
          .ingreso-agrupado-image03 {
            width: 20px;
            height: 18px;
          }
          .ingreso-agrupado-text18 {
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
          .ingreso-agrupado-image04 {
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
          .ingreso-agrupado-frame427319466 {
            top: 328px;
            left: 63px;
            width: 19px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .ingreso-agrupado-graficodebarras11 {
            width: 19px;
            height: 19px;
          }
          .ingreso-agrupado-button {
            top: 3px;
            left: 42px;
            width: 101px;
            height: 20px;
            z-index: 1;
            position: absolute;
            border-radius: 43px;
          }
          .ingreso-agrupado-text20 {
            top: 4px;
            left: 45px;
            color: rgba(255, 255, 255, 1);
            height: auto;
            z-index: 2;
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
          .ingreso-agrupado-frame427319465 {
            gap: 22px;
            top: 212px;
            left: 64px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
          }
          .ingreso-agrupado-image05 {
            width: 19px;
            height: 19px;
          }
          .ingreso-agrupado-rectangle45 {
            width: 101px;
            height: 20px;
            z-index: 1;
          }
          .ingreso-agrupado-text22 {
            left: 44px;
            color: rgba(255, 255, 255, 1);
            height: auto;
            z-index: 2;
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
          .ingreso-agrupado-frame427319464 {
            gap: 32px;
            top: 675px;
            left: 64px;
            width: 103px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .ingreso-agrupado-vector1 {
            width: 12px;
            height: 16px;
          }
          .ingreso-agrupado-text24 {
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
          .ingreso-agrupado-text26 {
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
          .ingreso-agrupado-image06 {
            top: 413px;
            left: 606px;
            width: 312px;
            height: 79px;
            position: absolute;
            border-radius: 30px;
          }
          .ingreso-agrupado-button1 {
            top: 431px;
            left: 626px;
            width: 275px;
            height: 43px;
            position: absolute;
            border-radius: 8px 8px 6px 5px;
          }
          .ingreso-agrupado-text28 {
            top: 432px;
            left: 626px;
            color: rgba(255, 255, 255, 1);
            width: 275px;
            height: auto;
            position: absolute;
            font-size: 32px;
            font-style: SemiBold;
            text-align: center;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }

          .ingreso-agrupado-frame427319463 {
            gap: 10px;
            top: 205px;
            left: 682px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }

          .ingreso-agrupado-text-box02 {
            width: 142px;
            height: 25px; 
            border-radius: 14px;
            background-color: #F3F3F3;
            text-align: center;
          }

          .ingreso-agrupado-image07 {
            top: 16px;
            left: 133px;
            width: 10px;
            height: 10px;
            z-index: 1;
            position: absolute;
          }
          .ingreso-agrupado-text30 {
            top: 276px;
            left: 706px;
            color: rgba(0, 0, 0, 1);
            width: 109px;
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
          .ingreso-agrupado-frame427319462 {
            gap: 10px;
            top: 296px;
            left: 682px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .ingreso-agrupado-text-box03 {
            width: 142px;
            height: 21px;
            border-radius: 14px;
            border-color:black;
            text-align:center;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-image08 {
            top: 16px;
            left: 133px;
            width: 10px;
            height: 10px;
            z-index: 1;
            position: absolute;
          }
          .ingreso-agrupado-frame427319461 {
            gap: 10px;
            top: 230px;
            left: 888px;
            width: 142px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .ingreso-agrupado-text-box04 {
            width: 142px;
            height: 21px;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-image09 {
            top: 16px;
            left: 133px;
            width: 10px;
            height: 10px;
            z-index: 1;
            position: absolute;
          }
          .ingreso-agrupado-rectangule {
            top: 512px;
            left: 293px;
            width: 929px;
            height: 163px;
            position: absolute;
            border-color: rgba(55, 179, 226, 1);
            border-style: solid;
            border-width: 3px;
            border-radius: 30px;
          }
          .ingreso-agrupado-text-box05 {
            top: 558px;
            left: 685px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text-box06 {
            top: 558px;
            left: 409px;
            width: 141px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text-box07 {
            top: 559px;
            left: 969px;
            width: 141px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text32 {
            top: 538px;
            left: 681px;
            color: rgba(0, 0, 0, 1);
            width: 159px;
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
          .ingreso-agrupado-text34 {
            top: 536px;
            left: 402px;
            color: rgba(0, 0, 0, 1);
            width: 155px;
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
          .ingreso-agrupado-text36 {
            top: 539px;
            left: 961px;
            color: rgba(0, 0, 0, 1);
            width: 172px;
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
          .ingreso-agrupado-image10 {
            top: 610px;
            left: 664px;
            width: 193px;
            height: 49px;
            position: absolute;
            border-radius: 30px;
          }
          .ingreso-agrupado-button2 {
            top: 621.134765625px;
            left: 676.37109375px;
            width: 170px;
            height: 27px;
            position: absolute;
            border-radius: 8px 8px 6px 5px;
          }
          .ingreso-agrupado-text38 {
            top: 621.75341796875px;
            left: 676.37109375px;
            color: rgba(255, 255, 255, 1);
            width: 170px;
            height: auto;
            position: absolute;
            font-size: 18px;
            font-style: SemiBold;
            text-align: center;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .ingreso-agrupado-frame427319460 {
            gap: 10px;
            top: 338px;
            left: 606px;
            width: 88px;
            display: flex;
            padding: 1px 18px;
            overflow: hidden;
            position: absolute;
            align-items: center;
            border-radius: 8px;
            justify-content: center;
            background-color: rgba(55, 179, 226, 1);
          }
          .ingreso-agrupado-text40 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Montserrat;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .ingreso-agrupado-text-box08 {
            top: 170px;
            left: 889px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text42 {
            top: 150px;
            left: 884px;
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
          .ingreso-agrupado-text44 {
            top: 210px;
            left: 889px;
            color: rgba(0, 0, 0, 1);
            width: 148px;
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
          .ingreso-agrupado-text-box09 {
            top: 281px;
            left: 889px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text46 {
            top: 261px;
            left: 940px;
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
          .ingreso-agrupado-text-box10 {
            top: 340px;
            left: 889px;
            width: 142px;
            height: 24px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text48 {
            top: 320px;
            left: 932px;
            color: rgba(0, 0, 0, 1);
            width: 55px;
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
          .ingreso-agrupado-text-box11 {
            top: 280px;
            left: 1071px;
            width: 142px;
            height: 21px;
            position: absolute;
            border-radius: 14px;
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text50 {
            top: 260px;
            left: 1081px;
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
          .ingreso-agrupado-text-box12 {
            top: 33%; /* Cambiado a porcentaje para hacerlo relativo al contenedor padre */
            left: 87%; /* Cambiado a porcentaje para hacerlo relativo al contenedor padre */
            transform: translate(-50%, -50%); /* Centrar el elemento en función del tamaño del contenedor padre */
            width: 10%; /* Cambiado a porcentaje para hacerlo relativo al contenedor padre */
            height: auto; /* Cambiado a unidades de vista para hacerlo relativo al ancho de la pantalla */
            position: absolute;
            border-radius: 2vw; /* Cambiado a unidades de vista para hacerlo relativo al ancho de la pantalla */
            background-color: #F3F3F3;
          }
          .ingreso-agrupado-text51 {
            top: 30%; /* Cambiado a porcentaje para hacerlo relativo al contenedor padre */
            left: 87%; /* Cambiado a porcentaje para hacerlo relativo al contenedor padre */
            transform: translate(-50%, -50%); /* Centrar el elemento en función del tamaño del contenedor padre */
            color: rgba(0, 0, 0, 1);
            width: auto; /* Cambiado a 'auto' para que se ajuste al contenido */
            height: auto;
            position: absolute;
            font-size: 1.2vw; /* Cambiado a unidades de vista para hacerlo relativo al ancho de la pantalla */
            font-style: medium; /* Cambiado a minúscula y a 'medium' */
            text-align: left;
            font-family: Montserrat, sans-serif; /* Añadido un respaldo de fuente genérica */
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
        }
        
          .ingreso-agrupado-frame427319459 {
            top: 393px;
            left: 64.60888671875px;
            width: 181px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .ingreso-agrupado-image11 {
            width: 15px;
            height: 14px;
          }
          .ingreso-agrupado-rectangle46 {
            width: 166px;
            height: 31px;
            z-index: 1;
          }
          .ingreso-agrupado-button3 {
            top: 3px;
            left: 26.39111328125px;
            width: 101px;
            height: 20px;
            z-index: 2;
            position: absolute;
            border-radius: 43px;
          }
          .ingreso-agrupado-text52 {
            left: 43.39111328125px;
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
        `}
      </style>
    </>
  )
}

export default IngresoAgrupado
