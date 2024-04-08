from typing import Dict, Any, Union
import pandas as pd
from plotly.graph_objects import Figure

from flask import Flask, request, Response, jsonify

import features.build_features as bf

import visualization.visualize as vl
import visualization.metrics as mt

#
#
# COSAS QUE ME GUSTARIA AGREGAR QUE AHORA NO SON POSIBLES
# - AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE "Y"
# - AL ELEGIR QUE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE

# GENERAL
# -AGREGAR EVENTO DE CLIC EN GRAFICOS
# - AGREGAR GRAFICO TIEMPO MEDIO DE ESTADIA DEL PACIENTE POR CADA MEDICO
# - AGREGAR GRAFICO TIEMPO MEDIO DE ESTADIA DEL PACIENTE POR CADA ENFERMERO
#
#
#
#

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

def get_args() -> Dict[str, Any]:
    """
    from_ format: yyyy-mm-dd
    to format: yyyy-mm-dd
    patient_age format: yyyy-01-01 00:00:00
    patient_isolated format:
        empty (patientisolated=) if want to be False
        any non-empty value if want to be True
    """
    args: Dict[str, Any] = {'from_': request.args.get('from', default=None, type=str),
            'to': request.args.get('to', default=None, type=str),
            'patient_age': request.args.get('patientage', default=None, type=str),
            'patient_isolated': request.args.get('patientisolated', default=None, type=bool),
            'patient_status': request.args.get('patientstatus', default=None, type=str),
            'patient_symptom': request.args.get('patientsymptom', default=None, type=str),
            'patient_healthcare_system': request.args.get('patienthealthcaresystem', default=None, type=str),
            'doctor_full_name': request.args.get('doctorfullname', default=None, type=str),
            'nurse_full_name': request.args.get('nursefullname', default=None, type=str),
            'box_type': request.args.get('boxtype', default=None, type=str)}
    return args

@app.route('/')
def index() -> str:
    return """
            <p>
            No deberias estar aca :( <br>
            Accede a algun grafico o metrica mediante las siguientes URL: <br>
            http://127.0.0.1:5000/number_patients_date/ <br>
            http://127.0.0.1:5000/number_patients_date/metrics/ <br>
            http://127.0.0.1:5000/top_queries_date/ <br>
            http://127.0.0.1:5000/top_queries_date/metrics/
            </p>
           """

@app.route('/number_patients_date/')
def chart_number_patients_date() -> Union[str, Response]:
    dic: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features('Patient', dic)

    if df.empty == True:
        return Response(status=204)

    df = bf.build_number_patients_date(df)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(df=df,
                     x='patient_entry_time',
                     y='number_of_patients',
                     x_title='Fecha de Ingreso',
                     y_title='Cantidad de Pacientes',
                     title='Cantidad de Pacientes por Fecha de Ingreso',
                     color='patient_triage_level',
                     mean=mean)

    return fig.to_html()

@app.route('/number_patients_date/metrics/')
def metrics_number_patients_date() -> Response:
    dic: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features('Patient', dic)

    if (df.empty):
        return Response(status=204)

    df = bf.build_number_patients_date(df)
    
    data: Dict[str, str] = mt.metrics_data(txt='pacientes',
                          df=df,
                          x='patient_entry_time',
                          y='number_of_patients',
                          z='patient_triage_level')
    return jsonify(data)


@app.route('/top_queries_date/')
def chart_top_queries_date() -> Union[str, Response]:
    dic: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features('Patient', dic)

    if df is None:
        return Response(status=204)

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, top, order)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.bar_chart(df=df,
                    x='patient_symptom',
                    y='symptom_count',
                    x_title='Motivo de Consulta',
                    y_title='Cantidad de Consultas',
                    title='Motivos de Consulta mas Frecuentes',
                    color='patient_triage_level',
                    mean=mean)

    return fig.to_html()

@app.route('/top_queries_date/metrics/')
def metrics_top_queries_date() -> Response:
    dic: Dict[str, Any] = get_args()

    df = bf.build_features('Patient', dic)

    if (df.empty):
        return Response(status=204)

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, top, order)
    
    data: Dict[str, str] = mt.metrics_data(txt='consultas',
                          df=df,
                          x='patient_symptom',
                          y='symptom_count',
                          z='patient_triage_level')
    
    return jsonify(data)

@app.route('/patients_mean_time_doctor/')
def patiens_mean_time_doctor() -> Union[str, Response]:
    dic: Dict[str, Any] = get_args()

    df: pd.DataFrame = bf.build_features('Patient', dic)

    if df is None:
        return Response(status=204)

    df = bf.build_patiens_mean_time_doctor()

    return Response(status=200)

    # fig: Figure = vl.line_chart(df=df,
    #                 x='user_full_name',
    #                 y='patient_mean_time',
    #                 x_title='Doctor',
    #                 y_title='Tiempo Medio de Estadia',
    #                 title='Tiempo Medio de Estadia de Pacientes por Doctor',
    #                 color='patient_triage_level')

    # return fig.to_html()


if __name__ == '__main__':
    app.run(debug=True)
