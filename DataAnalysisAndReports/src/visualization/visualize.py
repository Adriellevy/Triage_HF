import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import timedelta

# GRAPH OBJECTS METHOD
# def test(trace, points, selector):
#     print('FUNCIONA')

# def bar_chart(df, x, y, title, x_title, y_title, mean=None):
#     # Create a bar chart using Plotly Graph Objects
#     fig = go.FigureWidget([
#         go.Bar(
#         x=df[x],
#         y=df[y],
#         textposition='outside',
#         name=y_title,
#         hovertemplate='%{y}')])
    
#     # Update layout
#     fig.update_layout(
#         title=title,
#         xaxis_title=x_title,
#         yaxis_title=y_title,
#         title_x=0.5,
#         template='simple_white'
#     )

#     fig.update_traces(texttemplate = '%{y}', textposition = 'outside')

#     # Add mean line if specified
#     if mean:
#         mean_value = df[y].mean()
#         fig.add_trace(go.Scatter(
#             x=df[x],
#             y=[mean_value] * len(df),
#             mode='lines',
#             name='Media',
#             line=dict(color='red', width=2, dash='dash'),
#             hovertemplate=f'{mean_value:.2f}'
#         ))
#     return fig

# def bar_chart(df, x, y, title, x_title, y_title, mean = None):
#     fig = px.bar(df, x = x, y = y, barmode = "group")
#     fig.update_layout(title = title, xaxis_title = x_title, yaxis_title = y_title, title_x = 0.5, plot_bgcolor='white')
#     fig.update_traces(texttemplate = '%{y}', textposition = 'outside')
#     if(mean):
#         mean = df[y].mean()
#         fig.add_trace(go.Scatter(x = df[x],
#                                  y = [mean] * len(df),
#                                  mode = 'lines',
#                                  name = 'Media',
#                                  line = dict(color = 'red', width = 2, dash = 'dash'),
#                                  hovertemplate = '%{y:.2f}'))
#         # fig.add_annotation(
#         # xref = 'paper', yref = 'y',
#         # x = -0.03, y = mean,
#         # text = f'{mean:.2f}',
#         # showarrow = False,
#         # font = dict(color = 'red'))
#     return fig 

def bar_chart(df, x, y, title, x_title, y_title, color, mean = None):
    df_sum = df.groupby('MOTIVO DE CONSULTA')['CANTIDAD DE CONSULTAS'].sum().reset_index(name='CANTIDAD DE CONSULTAS')
    fig = px.bar(df, x = x, y = y, color = color, category_orders={x: df[x].unique()}, color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#FAFB9F','4': '#A0C791'})
    fig.update_layout(title = title, xaxis_title = x_title, yaxis_title = y_title, title_x = 0.5, plot_bgcolor='white', xaxis=dict(linecolor='black', showgrid=True), yaxis=dict(linecolor='black', showgrid=True))
    if(mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x = df_sum[x],
                                 y = [mean] * len(df_sum),
                                 mode = 'lines',
                                 name = 'Media',
                                 line = dict(color = 'red', width = 2, dash = 'dash'),
                                 hovertemplate = '%{y:.2f}'))
    return fig 

def line_chart(df, x, y, title, x_title, y_title, mean = None):
    fig = px.line(df, x = x, y = y, markers = True)
    fig.update_layout(title = title, xaxis_title = x_title, yaxis_title = y_title, title_x = 0.5, plot_bgcolor='white', xaxis=dict(linecolor='black', showgrid=True), yaxis=dict(linecolor='black', showgrid=True))
    if(mean):
        mean = df[y].mean()
        fig.add_trace(go.Scatter(x = df[x],
                                 y = [mean] * len(df),
                                 mode = 'lines',
                                 name = 'Media',
                                 line = dict(color = 'red', width = 2, dash = 'dash'),
                                 hovertemplate = '%{y:.2f}'))
        # fig.add_annotation(
        # xref = 'x', yref = 'y',
        # x = -0.5, y = mean,
        # text = f'{mean:.2f}',
        # showarrow = False,
        # font = dict(color = 'red'))
    return fig 


def get_last_week(df):
    end_date = df['FECHA DE INGRESO'].max()
    start_date = end_date - timedelta(days=6)
    return (start_date, end_date)

def filters(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    if(desde == None and hasta == None):
        desde, hasta = get_last_week(df)
    else:
        desde = pd.to_datetime(desde, format = '%d-%m-%Y', errors = 'coerce') 
        hasta = pd.to_datetime(hasta, format = '%d-%m-%Y', errors = 'coerce')  

    df = df[(df['FECHA DE INGRESO'] >= desde) & (df['FECHA DE INGRESO'] <= hasta)]
    df['FECHA DE INGRESO'] = df['FECHA DE INGRESO'].dt.strftime('%d-%m-%Y')      
       
    if(nombre_y_apellido != None):
        df = df[df['NOMBRE Y APELLIDO'] == nombre_y_apellido.upper()]

    if(motivo_de_consulta != None):
        df = df[df['MOTIVO DE CONSULTA'] == motivo_de_consulta.upper()]

    if(box != None):
        df = df[df['BOX'] == box]

    if(triage != None):
        df = df[df['TRIAGE'] == triage]

    if(medico != None):
        df = df[df['MEDICO'] == medico.upper()]

    if(enfermero != None):
        df = df[df['ENFERMERO'] == enfermero.upper()]

    if(alta != None):
        df = df[df['ALTA'] == alta.upper()]

    if(aislado != None):
        df = df[df['AISLADO'] == aislado]

    return df

def cant_pacientes_fecha(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)
    
    df = df.groupby('FECHA DE INGRESO', sort = False).size().reset_index()
    df.rename(columns={0: 'CANTIDAD DE PACIENTES'}, inplace = True)

    return df

def cant_pacientes_triage(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)
    
    df = df.groupby('TRIAGE', sort = False).size().reset_index()
    df.rename(columns={0: 'CANTIDAD DE PACIENTES'}, inplace = True)

    return df

def top_consultas_fecha(df, top=10, order=None, desde=None, hasta=None, nombre_y_apellido=None, motivo_de_consulta=None, box=None, triage=None, medico=None, enfermero=None, alta=None, aislado=None):
    # Filtrar el DataFrame según los parámetros proporcionados
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)

    # Contar la cantidad de consultas por motivo y triage
    count = df.groupby(['MOTIVO DE CONSULTA', 'TRIAGE']).size().reset_index(name='CANTIDAD DE CONSULTAS')

    # Obtener los n motivos de consulta más frecuentes
    top_motivos = count.groupby('MOTIVO DE CONSULTA')['CANTIDAD DE CONSULTAS'].sum().nlargest(top).index
    count = count[count['MOTIVO DE CONSULTA'].isin(top_motivos)] 

    # ASC
    count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(dict(zip(top_motivos[::-1], range(len(top_motivos))))), inplace = True)
    #count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(dict(zip(top_motivos, range(len(top_motivos))))), inplace = True)

    return count