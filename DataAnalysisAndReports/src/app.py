import os
from typing import Any, Dict, Union

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request
from pandas import DataFrame

import features.build_features as bf
import visualization.metrics as mt
import visualization.visualize as vl

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

load_dotenv('/data/.env')


# def get_args() -> Dict[str, Any]:
#     """
#     from_ format: yyyy-mm-dd
#     to format: yyyy-mm-dd
#     patient_age format: yyyy-01-01 00:00:00
#     patient_isolated format:
#         empty (patientisolated=) if want to be False
#         any non-empty value if want to be True
#     """
#     args: Dict[str, Any] = {
#         'from_': request.args.get('from', default=None, type=str),
#         'to': request.args.get('to', default=None, type=str),
#         'patient_age': request.args.get('patientage', default=None, type=str),
#         'patient_isolated': request.args.get(
#             'patientisolated', default=None, type=bool
#         ),
#         'patient_status': request.args.get('patientstatus', default=None, type=str),
#         'patient_symptom': request.args.get('patientsymptom', default=None, type=str),
#         'patient_healthcare_system': request.args.get(
#             'patienthealthcaresystem', default=None, type=str
#         ),
#         'doctor_full_name': request.args.get('doctorfullname', default=None, type=str),
#         'nurse_full_name': request.args.get('nursefullname', default=None, type=str),
#         'box_type': request.args.get('boxtype', default=None, type=str)
#     }
#     return args

def get_args() -> Dict[str, Any]:
    """
    from_ format: yyyy-mm-dd
    to format: yyyy-mm-dd
    """
    args = {
        'from_': request.args.get('from', type=str),
        'to': request.args.get('to', type=str)
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
            /patients_mean_time_doctor/ <br>
            /patients_mean_time_nurse/ <br>
            /patients_mean_time_date/ <br>
            <br>
            <b> Métricas </b> <br>
            /number_patients_date/metrics/ <br>
            /number_patients_date/isolated/metrics/ <br>   
            /number_patients_date/status/metrics/ <br>
            /number_patients_date/age/metrics/ <br>
            /top_queries_date/metrics/ <br>
            /top_queries_date/isolated/metrics/ <br>
            /top_queries_date/status/metrics/ <br>
            /top_queries_date/age/metrics/ <br>
            </p>
           """


# Getters.
def get_df_number_patients(group_cond: str, rename: Dict[Any, str] = None) -> Union[DataFrame, None]:
    dict = get_args()

    df = bf.build_features('Patient', dict)

    if df is None:
        return None
    elif df.empty or (df.shape[0] < 200 and os.getenv('CHARTS_RESTRICTION') == 'True'):
        return DataFrame()

    df = bf.build_number_patients_date(df, group_cond, rename)

    return df


def get_df_top_queries(group_cond: str, rename: Dict[Any, str] = None) -> Union[DataFrame, None]:
    dict = get_args()

    df = bf.build_features('Patient', dict)

    if df is None:
        return None
    elif df.empty or (df.shape[0] < 200 and os.getenv('CHARTS_RESTRICTION') == 'True'):
        return DataFrame()

    # top = request.args.get('top', default=10, type=int)
    # order = request.args.get('order', default='', type=str)

    df = bf.build_top_queries_date(df, group_cond, rename)
    return df


def get_patients_mean_time(group_cond1: str, group_cond2: str, filter_by: str = None) -> Union[DataFrame, None]:
    dict = get_args()

    dict[filter_by] = 'all'

    condition = bf.join_filters(dict)

    condition += " WHERE patient_status = 'ALTA'"

    df = bf.build_features('Patient', dict, condition)

    if df is None:
        return None
    elif df.empty or (df.shape[0] < 200 and os.getenv('CHARTS_RESTRICTION') == 'True'):
        return DataFrame()

    df = bf.build_patients_mean_time(df, group_cond1, group_cond2)
    return df


# Charts.
@app.route('/number_patients_date/')
def chart_number_patients_date() -> Union[str, Response]:
    df = get_df_number_patients('patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.line_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/number_patients_date/isolated/')
def chart_number_patients_date_isolated() -> Union[str, Response]:
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = get_df_number_patients('patient_isolated', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.line_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/number_patients_date/status/')
def chart_number_patients_date_status() -> Union[str, Response]:
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = get_df_number_patients('patient_status', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.line_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/number_patients_date/age/')
def chart_number_patients_date_age() -> Union[str, Response]:
    df = get_df_number_patients('patient_age_group')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.line_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/top_queries_date/')
def chart_top_queries_date() -> Union[str, Response]:
    df = get_df_top_queries('patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.bar_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/top_queries_date/isolated/')
def chart_top_queries_date_isolated() -> Union[str, Response]:
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = get_df_top_queries('patient_isolated', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.bar_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/top_queries_date/status/')
def chart_top_queries_date_status() -> Union[str, Response]:
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = get_df_top_queries('patient_status', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.bar_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/top_queries_date/age/')
def chart_top_queries_date_age() -> Union[str, Response]:
    df = get_df_top_queries('patient_age_group')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.bar_chart(
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
        mean=True
    )

    return fig.to_html()


@app.route('/patients_mean_time_doctor/')
def patiens_mean_time_doctor() -> Union[str, Response]:
    df = get_patients_mean_time('user_full_name', 'patient_triage_level', 'doctor_full_name')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    fig = vl.line_chart(
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


@app.route('/patients_mean_time_nurse/')
def patiens_mean_time_nurse() -> Union[str, Response]:
    df = get_patients_mean_time('user_full_name', 'patient_triage_level', 'nurse_full_name')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    fig = vl.line_chart(
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


@app.route('/patients_mean_time_date/')
def patients_mean_time_date() -> Union[str, Response]:
    df = get_patients_mean_time('patient_entry_time', 'patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    # mean: bool = request.args.get('mean', default=False, type=bool)

    fig = vl.line_chart(
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
        mean=True
    )

    return fig.to_html()


# Metrics.
@app.route('/number_patients_date/metrics/')
def metrics_number_patients_date() -> Response:
    df = get_df_number_patients('patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data = mt.metrics_data(
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
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = get_df_number_patients('patient_isolated', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'no': 'No',
        'si': 'Si',
    }

    data = mt.metrics_data(
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
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = get_df_number_patients('patient_satus', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'alta': 'Alta',
        'en_observacion': 'En observación',
        'en_espera_de_internacion': 'En espera de internación',
        'internado': 'Internado',
        'afuera': 'Afuera'
    }

    data = mt.metrics_data(
        txt='pacientes',
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        z='patient_status',
        expand=expand
    )
    return jsonify(data)


@app.route('/number_patients_date/age/metrics/')
def metrics_number_patients_date_age() -> Union[str, Response]:
    df = get_df_number_patients('patients_age_group')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        '0 a 40': '0 a 40',
        '41 a 60': '41 a 60',
        '61 a 80': '61 a 80',
        '+80': '+80'
    }

    data = mt.metrics_data(
        txt='pacientes',
        df=df,
        x='patient_entry_time',
        y='number_of_patients',
        z='patient_age_group',
        expand=expand
    )

    return jsonify(data)


@app.route('/top_queries_date/metrics/')
def metrics_top_queries_date() -> Response:
    df = get_df_top_queries('patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data = mt.metrics_data(
        txt='consultas',
        df=df,
        x='patient_symptom',
        y='symptom_count',
        z='patient_triage_level',
        expand=expand
    )

    return jsonify(data)


@app.route('/top_queries_date/isolated/metrics/')
def metrics_top_queries_date_isolated() -> Response:
    rename = {
        0: 'No',
        1: 'Si'
    }

    df = get_df_top_queries('patient_isolated', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'no': 'No',
        'si': 'Si',
    }

    data = mt.metrics_data(
        txt='consultas',
        df=df,
        x='patient_symptom',
        y='symptom_count',
        z='patient_isolated',
        expand=expand
    )

    return jsonify(data)


@app.route('/top_queries_date/status/metrics/')
def metrics_top_queries_date_status() -> Response:
    rename = {
        'ALTA': 'Alta',
        'EN OBSERVACION': 'En observación',
        'EN ESPERA DE INTERNACION': 'En espera de internación',
        'INTERNADO': 'Internado',
        'AFUERA': 'Afuera'
    }

    df = get_df_top_queries('patient_status', rename)

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'alta': 'Alta',
        'en_observacion': 'En observación',
        'en_espera_de_internacion': 'En espera de internación',
        'internado': 'Internado',
        'afuera': 'Afuera'
    }

    data = mt.metrics_data(
        txt='consultas',
        df=df,
        x='patient_symptom',
        y='symptom_count',
        z='patient_status',
        expand=expand
    )

    return jsonify(data)


@app.route('/top_queries_date/age/metrics/')
def metrics_top_queries_date_date_age() -> Union[str, Response]:
    df = get_df_top_queries('patient_age_group')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        '0 a 40': '0 a 40',
        '41 a 60': '41 a 60',
        '61 a 80': '61 a 80',
        '+80': '+80'
    }

    data = mt.metrics_data(
        txt='consultas',
        df=df,
        x='patient_symptom',
        y='symptom_count',
        z='patient_age_group',
        expand=expand
    )

    return jsonify(data)


@app.route('/patients_mean_time_doctor/metrics/')
def metrics_patients_mean_time_doctor() -> Union[Response, str]:
    df = get_patients_mean_time('user_full_name', 'patient_triage_level', 'doctor_full_name')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    fig = vl.line_chart(
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
    df = get_patients_mean_time('user_full_name', 'patient_triage_level', 'nurse_full_name')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data = mt.metrics_data(
        txt='enfermeros',
        df=df,
        x='user_full_name',
        y='patient_mean_delta_time',
        z='patient_triage_level',
        expand=expand
    )

    return jsonify(data)


@app.route('/patients_mean_time_date/metrics/')
def metrics_patients_mean_time_date() -> Response:
    df = get_patients_mean_time('patient_entry_time', 'patient_triage_level')

    if df is None:
        return Response('There was an error connecting to DB', status=500)
    elif df.empty:
        return Response('Not enough records to display', status=422)

    expand = {
        'triage_I': 'Nivel I',
        'triage_II': 'Nivel II',
        'triage_III': 'Nivel III',
        'triage_IV': 'Nivel IV'
    }

    data = mt.metrics_data(
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
    # app.run(debug=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
