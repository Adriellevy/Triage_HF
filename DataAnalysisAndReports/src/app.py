# Typed
from typing import Any, Dict, Union
from plotly.graph_objects import Figure

# Data handling
import pandas as pd

# Modules
import features.build_features as bf
import visualization.metrics as mt
import visualization.visualize as vl

# Server
from flask import Flask, Response, jsonify, request
# from waitress import serve



# COSAS QUE ME GUSTARIA AGREGAR QUE AHORA NO SON POSIBLES
# - AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE 'Y'
# - AL ELEGIR QUE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE
# - AGREGAR EVENTO DE CLIC EN GRAFICOS

# GENERAL
# - ESPERAR A LUQUITAS PARA QUE ACTUALICE EL EXIT_TIME DE LOS PACIENTES Y PROBAR LOS GRAFICOS CORRESPONDIENTES

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

def get_args() -> Dict[str, Any]:
    """ "
    from_ format: yyyy-mm-dd
    to format: yyyy-mm-dd
    patient_age format: yyyy-01-01 00:00:00
    patient_isolated format:
        empty (patientisolated=) if want to be False
        any non-empty value if want to be True
    """
    args: Dict[str, Any] = {
        "from_": request.args.get("from", default=None, type=str),
        "to": request.args.get("to", default=None, type=str),
        "patient_age": request.args.get("patientage", default=None, type=str),
        "patient_isolated": request.args.get(
            "patientisolated", default=None, type=bool
        ),
        "patient_status": request.args.get("patientstatus", default=None, type=str),
        "patient_symptom": request.args.get("patientsymptom", default=None, type=str),
        "patient_healthcare_system": request.args.get(
            "patienthealthcaresystem", default=None, type=str
        ),
        "doctor_full_name": request.args.get("doctorfullname", default=None, type=str),
        "nurse_full_name": request.args.get("nursefullname", default=None, type=str),
        "box_type": request.args.get("boxtype", default=None, type=str),
    }
    return args


@app.route("/")
def index() -> str:
    return """
            <p>
            Accede a algún gráfico o métrica mediante las siguientes rutas: <br>
            <b> Gráficos </b> <br>
            /number_patients_date/ <br>
            /top_queries_date/ <br>
            /patients_mean_time_doctor/ <br>
            /patients_mean_time_nurse/ <br>
            <br>
            <b> Métricas </b> <br>
            /number_patients_date/metrics/ <br>
            /top_queries_date/metrics/ <br>
            </p>
           """


@app.route("/number_patients_date/")
def chart_number_patients_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features("Patient", dict)

    if df.empty == True:
        return Response(status=204)

    df = bf.build_number_patients_date(df)

    mean: bool = request.args.get("mean", default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x="patient_entry_time",
        y="number_of_patients",
        x_title="Fecha de Ingreso",
        y_title="Cantidad de Pacientes",
        title="Cantidad de Pacientes por Fecha de Ingreso",
        color="patient_triage_level",
        y_txt="pacientes",
        mean=mean,
    )

    return fig.to_html()


@app.route("/number_patients_date/metrics/")
def metrics_number_patients_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features("Patient", dict)

    if df.empty:
        return Response(status=204)

    df = bf.build_number_patients_date(df)

    data: Dict[str, str] = mt.metrics_data(
        txt="pacientes",
        df=df,
        x="patient_entry_time",
        y="number_of_patients",
        z="patient_triage_level",
    )
    return jsonify(data)


@app.route("/top_queries_date/")
def chart_top_queries_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features("Patient", dict)

    if df is None:
        return Response(status=204)

    top: int = request.args.get("top", default=10, type=int)
    order: str = request.args.get("order", default="", type=str)

    df = bf.build_top_queries_date(df, top, order)

    mean: bool = request.args.get("mean", default=False, type=bool)

    fig: Figure = vl.bar_chart(
        df=df,
        x='patient_symptom',
        y='symptom_count',
        x_title='Motivo de Consulta',
        y_title='Cantidad de Consultas',
        title='Motivos de Consulta más Frecuentes',
        color='patient_triage_level',
        y_txt='consultas',
        mean=mean,
    )

    return fig.to_html()


@app.route("/top_queries_date/metrics/")
def metrics_top_queries_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df = bf.build_features("Patient", dict)

    if df.empty:
        return Response(status=204)

    top: int = request.args.get("top", default=10, type=int)
    order: str = request.args.get("order", default="", type=str)

    df = bf.build_top_queries_date(df, top, order)

    data: Dict[str, str] = mt.metrics_data(
        txt="consultas",
        df=df,
        x="patient_symptom",
        y="symptom_count",
        z="patient_triage_level",
    )

    return jsonify(data)


@app.route('/patients_mean_time_doctor/')
def patiens_mean_time_doctor() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    dict["doctor_full_name"] = "all"

    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty == True:
        return Response(status=204)
    
    df = bf.build_patients_mean_time_doctor(df)
    
    fig: Figure = vl.line_chart(
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        x_title='Doctor',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Doctor',
        y_txt='Minutos',
        color='patient_triage_level',
    )

    return fig.to_html()

@app.route('/patients_mean_time_doctor/metrics/')
def metrics_patients_mean_time_doctor() -> Response:
    dict: Dict[str, Any] = get_args()

    dict['doctor_full_name'] = 'all'
    
    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty == True:
        return Response(status=204)
    
    df = bf.build_patients_mean_time_doctor(df)
    
    data: Dict[str, str] = mt.metrics_data(
        txt='medicos',
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        z='patient_triage_level',
    )

    return jsonify(data)

@app.route('/patients_mean_time_nurse/')
def patiens_mean_time_nurse() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    dict['nurse_full_name'] = 'all'
    
    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty == True:
        return Response(status=204)
    
    df = bf.build_patients_mean_time_nurse(df)
    
    fig: Figure = vl.line_chart(
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        x_title='Enfermero',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Enfermero',
        y_txt='Minutos',
        color='patient_triage_level',
    )

    return fig.to_html()

@app.route('/patients_mean_time_nurse/metrics/')
def metrics_patients_mean_time_nurse() -> Response:
    dict: Dict[str, Any] = get_args()

    dict['nurse_full_name'] = 'all'
    
    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty == True:
        return Response(status=204)
    
    df = bf.build_patients_mean_time_doctor(df)
    
    data: Dict[str, str] = mt.metrics_data(
        txt='enfermeros',
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        z='patient_triage_level',
    )

    return jsonify(data)

@app.route('/patients_mean_time_date/')
def patients_mean_time_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features('Patient', dict)

    if df.empty == True:
        return Response(status=204)

    df = bf.build_patients_mean_time_date(df)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='patient_mean_delta_time',
        x_title='Fecha de Ingreso',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Fecha de Ingreso',
        color='patient_triage_level',
        y_txt='minutos',
        mean=mean,
    )

    return fig.to_html()

@app.route('/patients_mean_time_date/metrics/')
def metrics_patients_mean_time_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df = bf.build_features('Patient', dict)

    if df.empty == True:
        return Response(status=204)
    
    df = bf.build_patients_mean_time_date(df)
    
    data: Dict[str, str] = mt.metrics_data(
        txt='minutos',
        df=df,
        x='patient_entry_time',
        y='patient_mean_delta_time',
        z='patient_triage_level',
    )

    return jsonify(data)    

# waitress-serve --host 192.168.0.99 app:app  

# serve(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    app.run(debug=True)
    