from flask import Flask, request

from data.make_dataset import get_df
from features.build_features import build_features
from visualization.visualize import cant_pacientes_fecha
from visualization.visualize import bar_chart

app = Flask(__name__)


@app.route('/')
def mostrar_grafico():
    desde = request.args.get('desde', default=None, type=str)
    hasta = request.args.get('hasta', default=None, type=str)
    nombreyapellido = request.args.get('nombreyapellido', default=None, type=str)
    triage = request.args.get('triage', default=None, type=str)
    medico = request.args.get('medico', default=None, type=str)
    alta = request.args.get('alta', default=None, type=str)

    print("Desde:", desde)
    print("Hasta:", hasta)
    print("Nombre y Apellido:", nombreyapellido)
    print("Triage:", triage)
    print("Médico:", medico)
    print("Alta:", alta)

    df = get_df()
    df = build_features(df)
    df = cant_pacientes_fecha(df = df)

    # Dejar fijo
    fig = bar_chart(df = df, 
               x='FECHA DE INGRESO', y='CANTIDAD DE PACIENTES', 
               x_title='Cantidad de Pacientes por Fecha de Ingreso', y_title='Fecha de Ingreso', title='Cantidad de Pacientes', 
               mean=True)
    return fig.to_html()

    

if __name__ == '__main__':
    app.run(debug=True)