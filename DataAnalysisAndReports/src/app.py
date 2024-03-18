from flask import Flask, request

from data.make_dataset import get_table

#from features.build_features import build_features

from visualization.visualize import number_patients_date, top_queries_date
from visualization.visualize import bar_chart, line_chart


# TOD0S LOS CHARTS
# ANIMACIONES AL APARACER LOS GRAFICOS
# LAS LINEAS PUNTEADAS DE LA MEDIA DEBEN OCUPAR TODO EL GRAFICO
# AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE "Y"

# BARCHARTS
# ORDENAR CORRECTAMENTE LOS NIVELES DE TRIAGE PARA CUALQUIER FECHA
# AL ELEGIR QUE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE

# LINECHARTS
# AJUSTAR ANCHO DE LINEA

# GENERAL
# ACTUALIZAR JUPYTER NOTEBOOK
# !ADAPTAR TODO A LA BASE DE DATOS
# ?AGREGAR EVENTO DE CLIC EN GRAFICOS


app = Flask(__name__)


def get_args():
    args = {'from_': request.args.get('from', default=None, type=str),
            'to': request.args.get('to', default=None, type=str),
            'name_lastname': request.args.get('namelastname', default=None, type=str),
            'consulting_reason': request.args.get('consultingreason', default=None, type=str),
            'box': request.args.get('box', default=None, type=int),
            'doctor': request.args.get('doctor', default=None, type=str),
            'nurse': request.args.get('nurse', default=None, type=str),
            'discharged': request.args.get('discharged', default=None, type=str),
            'isolated': request.args.get('isolated', default=None, type=bool)
            }
    return args


@app.route('/number_patients_date/')
def chart_number_patients_date():
    df = get_table("PATIENT")

    df = number_patients_date(
        df, **get_args())

    # mean = request.args.get('mean', default=None, type=bool)
    # fig = line_chart(df=df_number_patients_date,
    #                  x='FECHA DE INGRESO',
    #                  y='CANTIDAD DE PACIENTES',
    #                  x_title='Fecha de Ingreso',
    #                  y_title='Cantidad de Pacientes',
    #                  title='Cantidad de Pacientes por Fecha de Ingreso',
    #                  color='TRIAGE',
    #                  mean=mean)

    # return fig.to_html()
    return None


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
