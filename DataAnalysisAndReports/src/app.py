from flask import Flask, request

from data.make_dataset import get_df
from features.build_features import build_features
from visualization.visualize import cant_pacientes_fecha
from visualization.visualize import bar_chart

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
             'triage': request.args.get('triage', default=None, type=float),
             'medico': request.args.get('medico', default=None, type=str),
             'enfermero': request.args.get('enfermero', default=None, type=str),
             'alta': request.args.get('alta', default=None, type=str),
             'aislado': request.args.get('aislado', default=None, type=bool)
            }
    return args

@app.route('/cant_pacientes_fecha/')
def grafico_cant_pacientes_fecha():
    global df
    df_acotado = cant_pacientes_fecha(df, **get_args())

    media = request.args.get('media', default=None, type=bool)

    # Dejar fijo
    fig = bar_chart(df = df_acotado, 
               x='FECHA DE INGRESO', y='CANTIDAD DE PACIENTES', 
               x_title='Fecha de Ingreso', y_title='Cantidad de Pacientes', title='Cantidad de Pacientes por Fecha de Ingreso', 
               mean = media)
    
    return fig.to_html()

if __name__ == '__main__':
    app.run(debug=True)
    initialize_data()