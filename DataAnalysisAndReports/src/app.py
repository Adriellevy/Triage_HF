from flask import Flask, request, Response

import data.make_dataset as md

#from features.build_features import build_features

from visualization.visualize import number_patients_date, top_queries_date
from visualization.visualize import bar_chart, line_chart


# TOD0S LOS CHARTS
# ANIMACIONES AL APARACER LOS GRAFICOS
# LAS LINEAS PUNTEADAS DE LA MEDIA DEBEN OCUPAR TOD0 EL GRAFICO
# AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE "Y"

# BARCHARTS
# ORDENAR CORRECTAMENTE LOS NIVELES DE TRIAGE PARA CUALQUIER FECHA
# AL EGIR QULEE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE

# LINECHARTS
# AJUSTAR ANCHO DE LINEA

# GENERAL
# ACTUALIZAR JUPYTER NOTEBOOK
# -AGREGAR EVENTO DE CLIC EN GRAFICOS
# CONTEMPLAR QUE PASA CUANDO LA BD ESTA VACIA



app = Flask(__name__)


def get_args():
    args = {'from_': request.args.get('from', default=None, type=str),
            'to': request.args.get('to', default=None, type=str),
            'patient_name': request.args.get('patientname', default=None, type=str),
            'patient_problem': request.args.get('patientproblem', default=None, type=str),
            'box_type': request.args.get('boxtype', default=None, type=int),
            'doctor_username': request.args.get('doctorusername', default=None, type=str),
            'nurse_username': request.args.get('nurseusername', default=None, type=str),
            'discharged': request.args.get('discharged', default=None, type=str),
            'isolated': request.args.get('isolated', default=None, type=bool)
            }
    return args


@app.route('/number_patients_date/')
def chart_number_patients_date():
    df = md.get_table('Patient')

    if (df.empty):
        return Response(status=204)
    
    df = number_patients_date(
        df, **get_args())

    mean = request.args.get('mean', default=None, type=bool)
    
    fig = line_chart(df=df,
                     x='entry_time',
                     y='number_of_patients',
                     x_title='Fecha de Ingreso',
                     y_title='Cantidad de Pacientes',
                     title='Cantidad de Pacientes por Fecha de Ingreso',
                     color='patient_triage_level',
                     mean=mean)

    return fig.to_html()


@app.route('/top_queries_date/')
def chart_top_queries_date():
    global df
    df_number_patients_date = df.copy(deep=True)

    top = request.args.get('top', default=10, type=int)
    order = request.args.get('order', default=None, type=str)
    df_number_patients_date = top_queries_date(
        df_number_patients_date, top, order, **get_args())

    mean = request.args.get('mean', default=None, type=bool)
    fig = bar_chart(df=df_number_patients_date,
                    x='MOTIVO DE CONSULTA',
                    y='CANTIDAD DE CONSULTAS',
                    x_title='Motivo de Consulta',
                    y_title='Cantidad de Consultas',
                    title='Motivos de Consulta mas Frecuentes',
                    color='TRIAGE',
                    mean=mean)

    return fig.to_html()


if __name__ == '__main__':
    app.run(debug=True)
