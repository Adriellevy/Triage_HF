from flask import Flask

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import datetime as dt

app = Flask(__name__)

train_df = pd.read_csv('../dataset/raw/TRIAGE_2024.csv')

@app.route('/grafico')
def mostrar_grafico():
    # Datos de ejemplo (reemplázalos con tus propios datos)
    x = [1, 2, 3, 4, 5]
    y = [10, 11, 9, 12, 8]

    # Crear el gráfico
    scatter_plot = go.Scatter(x=x, y=y, mode='markers', name='Puntos')

    # Configurar el diseño del gráfico
    layout = go.Layout(title='Mi Gráfico de Dispersión', xaxis=dict(title='Eje X'), yaxis=dict(title='Eje Y'))

    # Crear la figura
    fig = go.Figure(data=[scatter_plot], layout=layout)

    # Renderizar el gráfico en HTML
    return fig.to_html()

    

if __name__ == '__main__':
    app.run(debug=True)