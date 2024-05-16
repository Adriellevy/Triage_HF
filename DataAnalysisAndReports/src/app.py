from typing import Any, Dict, Union
from plotly.graph_objects import Figure
from pandas import DataFrame

import features.build_features as bf
import visualization.metrics as mt
import visualization.visualize as vl
from flask import Flask, Response, jsonify, request
from plotly.graph_objects import Figure



# [COSAS QUE ME GUSTARIA AGREGAR QUE AHORA NO SON POSIBLES]
# - AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE 'Y'
# - AL ELEGIR QUE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE

# TODO
# MODIFICAR LOS ARGS EN BASE A LOS COLOR MAPS NUEVOS
# ARREGLAR TOP QUERIES DATE METRICS

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
    args: Dict[str, Any] = {
        'from_': request.args.get('from', default=None, type=str),
        'to': request.args.get('to', default=None, type=str),
        'patient_age': request.args.get('patientage', default=None, type=str),
        'patient_isolated': request.args.get(
            'patientisolated', default=None, type=bool
        ),
        'patient_status': request.args.get('patientstatus', default=None, type=str),
        'patient_symptom': request.args.get('patientsymptom', default=None, type=str),
        'patient_healthcare_system': request.args.get(
            'patienthealthcaresystem', default=None, type=str
        ),
        'doctor_full_name': request.args.get('doctorfullname', default=None, type=str),
        'nurse_full_name': request.args.get('nursefullname', default=None, type=str),
        'box_type': request.args.get('boxtype', default=None, type=str)
    }
    return args


@app.route('/')
def index() -> str:
    return """
            <p>
            Accede a algún gráfico o métrica mediante las siguientes rutas: <br>
            <b> Gráficos </b> <br>
            /number_patients_date/ <br>
            /number_patients_date/isolated/ <br>
            /number_patients_date/status/ <br>
            /number_patients_date/age/ <br>
            /top_queries_date/ <br>
            /top_queries_date/isolated/ <br>
            /top_queries_date/status/ <br>
            /top_queries_date/age/ <br>
            <br>
            /patients_mean_time_doctor/ <br>
            /patients_mean_time_nurse/ <br>
            <br>
            <b> Métricas </b> <br>
            /number_patients_date/metrics/ <br>
            /number_patients_date/isolated/metrics/ <br>   
            /top_queries_date/metrics/ <br>
            </p>
           """


@app.route('/number_patients_date/')
def chart_number_patients_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    print(f'df size: {df.shape[0]}')

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response('No hay suficientes registros para mostrar (deben ser mas de 200)',status=422)    

    df = bf.build_number_patients_date(df, 'patient_triage_level')

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        x_title='Fecha de Ingreso',
        y_title='Cantidad de Pacientes',
        title='Cantidad de Pacientes por Fecha de Ingreso',
        legend_title='Nivel de Triage',
        color='patient_triage_level',
        color_map='triage_color_map',
        y_txt='pacientes',
        mean=mean
    )

    return fig.to_html()

@app.route('/number_patients_date/isolated/')
def chart_number_patients_date_isolated() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = bf.build_number_patients_date(df, 'patient_isolated', rename)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        x_title='Fecha de Ingreso',
        y_title='Cantidad de Pacientes',
        title='Cantidad de Pacientes por Fecha de Ingreso',
        legend_title='¿Se encuentra aislado?',
        color='patient_isolated',
        color_map='isolated_discrete_map',
        y_txt='pacientes',
        mean=mean
    )

    return fig.to_html()

@app.route('/number_patients_date/status/')
def chart_number_patients_date_status() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = bf.build_number_patients_date(df, 'patient_status', rename)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        x_title='Fecha de Ingreso',
        y_title='Cantidad de Pacientes',
        title='Cantidad de Pacientes por Fecha de Ingreso',
        legend_title='Estados',
        color='patient_status',
        color_map='status_discrete_map',
        y_txt='pacientes',
        mean=mean
    )

    return fig.to_html()

@app.route('/number_patients_date/age/')
def chart_number_patients_date_age() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    df = bf.build_number_patients_date(df, 'patient_age_group')

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        x_title='Fecha de Ingreso',
        y_title='Cantidad de Pacientes',
        title='Cantidad de Pacientes por Fecha de Ingreso',
        legend_title='Grupos de edades',
        color='patient_age_group',
        color_map='age_range_discrete_map',
        y_txt='pacientes',
        mean=mean
    )

    return fig.to_html()


@app.route('/number_patients_date/metrics/')
def metrics_number_patients_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)

    df = bf.build_number_patients_date(df, 'patient_triage_level')

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data: Dict[str, str] = mt.metrics_data(
        txt='pacientes',
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        z='patient_triage_level',
        expand=expand
    )
    return jsonify(data)

@app.route('/number_patients_date/isolated/metrics/')
def metrics_number_patients_date_isolated() -> Response:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = bf.build_number_patients_date(df, 'patient_isolated', rename)

    expand = {
        'no': 'No',
        'si': 'Si',
    }

    data: Dict[str, str] = mt.metrics_data(
        txt='pacientes',
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        z='patient_isolated',
        expand=expand
    )
    return jsonify(data)    

@app.route('/number_patients_date/status/metrics/')
def metrics_number_patients_date_metrics() -> Response:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = bf.build_number_patients_date(df, 'patient_status', rename)

    expand = {
        'alta': 'Alta',
        'en_observacion': 'En observación',
        'en_espera_de_internacion': 'En espera de internación',
        'internado': 'Internado',
        'afuera': 'Afuera'
    }

    data: Dict[str, str] = mt.metrics_data(
        txt='pacientes',
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        z='patient_status',
        expand=expand
    )
    return jsonify(data)    

@app.route('/top_queries_date/')
def chart_top_queries_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, 'patient_triage_level', top, order)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.bar_chart(
        df=df,
        x='patient_symptom',
        y='symptom_count',
        x_title='Motivo de Consulta',
        y_title='Cantidad de Consultas',
        title='Motivos de Consulta mas Frecuentes',
        legend_title='Nivel de Triage',
        color='patient_triage_level',
        color_map='triage_color_map',
        y_txt='consultas',
        mean=mean
    )

    return fig.to_html()

@app.route('/top_queries_date/isolated/')
def chart_top_queries_date_isolated() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)      

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)
    
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = bf.build_top_queries_date(df, 'patient_isolated', top, order, rename)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.bar_chart(
        df=df,
        x='patient_symptom',
        y='symptom_count',
        x_title='Motivo de Consulta',
        y_title='Cantidad de Consultas',
        title='Motivos de Consulta mas Frecuentes',
        legend_title='¿Se encuentra aislado?',
        color='patient_isolated',
        color_map='isolated_discrete_map',
        y_txt='consultas',
        mean=mean
    )

    return fig.to_html()

@app.route('/top_queries_date/status/')
def chart_top_queries_date_status() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)
    
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = bf.build_top_queries_date(df, 'patient_status', top, order, rename)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.bar_chart(
        df=df,
        x='patient_symptom',
        y='symptom_count',
        x_title='Motivo de Consulta',
        y_title='Cantidad de Consultas',
        title='Motivos de Consulta mas Frecuentes',
        legend_title='Estados',
        color='patient_status',
        color_map='status_discrete_map',
        y_txt='consultas',
        mean=mean
    )

    return fig.to_html()

@app.route('/top_queries_date/age/')
def chart_top_queries_date_age() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)  

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, 'patient_age_group', top, order)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.bar_chart(
        df=df,
        x='patient_symptom',
        y='symptom_count',
        x_title='Motivo de Consulta',
        y_title='Cantidad de Consultas',
        title='Motivos de Consulta mas Frecuentes',
        legend_title='Grupos de edades',
        color='patient_age_group',
        color_map='age_range_discrete_map',
        y_txt='consultas',
        mean=mean
    )

    return fig.to_html()


@app.route('/top_queries_date/metrics/')
def metrics_top_queries_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    top: int = request.args.get('top', default=10, type=int)
    order: str = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, 'patient_triage_level', top, order)

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data: Dict[str, str] = mt.metrics_data(
        txt='consultas',
        df=df,
        x='patient_symptom',
        y='symptom_count',
        z='patient_triage_level',
        expand=expand
    )

    return jsonify(data)


@app.route('/patients_mean_time_doctor/')
# http://localhost:5173/stats/patients_mean_time_doctor
def patiens_mean_time_doctor() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    dict['doctor_full_name'] = 'all'

    condition: str = bf.join_filters(dict)
    
    condition = condition + " WHERE patient_status = 'ALTA'"

    df = bf.build_features('Patient', dict, condition)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    df = bf.build_patients_mean_time_doctor(df)
    
    fig: Figure = vl.line_chart(
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        x_title='Doctor',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Doctor',
        legend_title='Nivel de Triage',
        color='patient_triage_level',
        color_map='triage_color_map',
        y_txt='Minutos'
    )

    return fig.to_html()

@app.route('/patients_mean_time_doctor/metrics/')
def metrics_patients_mean_time_doctor() -> Response:
    dict: Dict[str, Any] = get_args()

    dict['doctor_full_name'] = 'all'
    
    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    df = bf.build_patients_mean_time_doctor(df)

    fig: Figure = vl.line_chart(
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        x_title='Enfermero',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Enfermero',
        legend_title='Nivel de Triage',
        color='patient_triage_level',
        color_map='triage_color_map',
        y_txt='Minutos'
    )

    return fig.to_html()

@app.route('/patients_mean_time_nurse/metrics/')
def metrics_patients_mean_time_nurse() -> Response:
    dict: Dict[str, Any] = get_args()

    dict['nurse_full_name'] = 'all'
    
    condition: str = bf.join_filters(dict)

    df = bf.build_features('Patient', dict, condition)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)   
    
    df = bf.build_patients_mean_time_doctor(df)
    
    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }    
    
    data: Dict[str, str] = mt.metrics_data(
        txt='enfermeros',
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        z='patient_triage_level',
        expand=expand
    )

    return jsonify(data)

@app.route('/patients_mean_time_date/')
def patients_mean_time_date() -> Union[str, Response]:
    dict: Dict[str, Any] = get_args()

    df: DataFrame = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    

    df = bf.build_patients_mean_time_date(df)

    mean: bool = request.args.get('mean', default=False, type=bool)

    fig: Figure = vl.line_chart(
        df=df,
        x='patient_entry_time',
        y='patient_mean_delta_time',
        x_title='Fecha de Ingreso',
        y_title='Tiempo Medio de Estadía',
        title='Tiempo Medio de Estadía de Pacientes por Fecha de Ingreso',
        legend_title='Nivel de Triage',
        color='patient_triage_level',
        color_map='triage_color_map',
        y_txt='minutos',
        mean=mean
    )

    return fig.to_html()

@app.route('/patients_mean_time_date/metrics/')
def metrics_patients_mean_time_date() -> Response:
    dict: Dict[str, Any] = get_args()

    df = bf.build_features('Patient', dict)

    if df.empty:
        return Response('No hay registros para mostrar', status=204)
    elif df.shape[0] < 200:
        return Response(status=422)    
    
    df = bf.build_patients_mean_time_date(df)
    
    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data: Dict[str, str] = mt.metrics_data(
        txt='minutos',
        df=df,
        x='patient_entry_time',
        y='patient_mean_delta_time',
        z='patient_triage_level',
        expand=expand
    )

    return jsonify(data)    

# waitress-serve --host 192.168.0.99 app:app  

# serve(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(debug=True, host="192.168.0.83", port=5000)
    