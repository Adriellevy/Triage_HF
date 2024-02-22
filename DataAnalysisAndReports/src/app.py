from flask import Flask

from data.make_dataset import get_df
from features.build_features import build_features
from visualization.visualize import cant_pacientes_fecha
from visualization.visualize import bar_chart

app = Flask(__name__)


@app.route('/')
def mostrar_grafico():
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