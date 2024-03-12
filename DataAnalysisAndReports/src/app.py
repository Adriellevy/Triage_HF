from flask import Flask, request

from data.make_dataset import get_df

from features.build_features import build_features

from visualization.visualize import cant_pacientes_fecha, top_consultas_fecha
from visualization.visualize import bar_chart, line_chart


# TOD0S LOS CHARTS
# SACAR FILTRO POR TRIAGE
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
# ACOMODAR CODIGO PREVIO AL MERGE CON MAIN BRANCH
# ACTUALIZAR JUPYTER NOTEBOOK
# ADAPTAR TODO A LA BASE DE DATOS
# ?AGREGAR EVENTO DE CLIC EN GRAFICOS


app = Flask(__name__)

def initialize_data():
    df = get_df()
    df = build_features(df)
    return df

df = initialize_data()

def get_args():
    args = { 'desde': request.args.get('desde', default=None, type=str),
             'hasta': request.args.get('hasta', default=None, type=str),
             'nombre_y_apellido': request.args.get('nombreyapellido', default=None, type=str),
             'motivo_de_consulta': request.args.get('motivodeconsulta', default=None, type=str),
             'box': request.args.get('box', default=None, type=int),
             'medico': request.args.get('medico', default=None, type=str),
             'enfermero': request.args.get('enfermero', default=None, type=str),
             'alta': request.args.get('alta', default=None, type=str),
             'aislado': request.args.get('aislado', default=None, type=bool)
            }
    return args

@app.route('/cant_pacientes_fecha/')
def grafico_cant_pacientes_fecha():
    global df
    df_cant_pacientes_fecha = df.copy(deep=True)
    
    df_cant_pacientes_fecha = cant_pacientes_fecha(df_cant_pacientes_fecha, **get_args())

    media = request.args.get('media', default=None, type=bool)
    fig = line_chart(df=df_cant_pacientes_fecha, 
               x='FECHA DE INGRESO', 
               y='CANTIDAD DE PACIENTES', 
               x_title='Fecha de Ingreso', 
               y_title='Cantidad de Pacientes', 
               title='Cantidad de Pacientes por Fecha de Ingreso',
               color='TRIAGE',
               mean=media)
    
    return fig.to_html()

@app.route('/top_consultas_fecha/')
def grafico_top_consultas_fecha():
    global df
    df_top_consultas_fecha = df.copy(deep=True)

    top = request.args.get('top', default=10, type=int)
    order = request.args.get('order', default=None, type=str)
    df_top_consultas_fecha = top_consultas_fecha(df_top_consultas_fecha, top, order, **get_args())

    media = request.args.get('media', default=None, type=bool)
    fig = bar_chart(df=df_top_consultas_fecha, 
               x='MOTIVO DE CONSULTA', 
               y='CANTIDAD DE CONSULTAS', 
               x_title='Motivo de Consulta',
               y_title='Cantidad de Consultas', 
               title='Motivos de Consulta mas Frecuentes', 
               color='TRIAGE',
               mean = media)    
    
    return fig.to_html()

if __name__ == '__main__':
    app.run(debug=True)