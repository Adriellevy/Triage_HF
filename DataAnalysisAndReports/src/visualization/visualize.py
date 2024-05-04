# Typed
from typing import Any, Dict, Union
from plotly.graph_objects import Figure

# Chart
import plotly.express as px
import plotly.graph_objects as go

# AJUSTAR VALOR DE 'x'
# fig.add_annotation(
# xref = 'x', yref = 'y',
# x = -0.5, y = mean,
# text = f'{mean:.2f}',
# showarrow = False,
# font = dict(color = 'red'))

color_discrete_map: Dict = {
    'triage_color_map': { 'Nivel I': '#BDBEBE', 
                          'Nivel II': '#FA8162', 
                          'Nivel III': '#CCCC52', 
                          'Nivel IV': '#A0C791' },
    'isolated_discrete_map': { 'Si': '#A0C791',
                                'No': '#FA8162' },
    'status_discrete_map': { 'Alta': '#A0C791',
                             'En observacion': '#BDBEBE',
                             'En espera de internacion': '#CCCC52',
                             'Internado': '#FA8162',
                             'Afuera': "#FFE030" },
    'age_range_discrete_map': { '0 a 40': '#000000',
                                 '40 a 60': '#000000',
                                 '60 a 80': '#000000',
                                 '+80': '#000000' }
}

def include_mean(fig: Figure, df, x, y):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    mean = df_sum[y].mean()
    fig.add_trace(go.Scatter(x=df_sum[x],
                                 y=[mean] * len(df_sum),
                                 mode='lines',
                                 name='Media (Total)',
                                 line=dict(color='red', width=2, dash='dash'),
                                 hovertemplate='<b>%{y:.2f} pacientes</b>'))
        
def update_layout(fig, title, x_title, y_title):
    fig.update_layout(title=f'<b>{title}</b>',
                      title_x=0.5,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True),
                      yaxis=dict(linecolor='black', showgrid=True),
                      legend=dict(title='Nivel de Triage'))
    
def update_traces_lines(fig, y_txt: str):      
    fig.update_layout(hovermode='x unified')
    fig.update_traces(mode='markers+lines', 
                      hovertemplate='<b>%{y}' + f' {y_txt}<b>')  

def update_traces_bar(fig, y_txt: str):
    fig.update_layout(hovermode='x unified')    
    fig.update_traces(hovertemplate='<b>%{y}' + f' {y_txt}<b>',
                      width=0.325)
    
def add_total_line(fig, df, x, y):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig.add_trace(go.Scatter(x=df_sum[x], 
                             y=df_sum[y], 
                             line=dict(color='#3B82F6'), 
                             mode='lines', 
                             name='Total'))
    

def line_chart(df, x, y, title, x_title, y_title, color, color_map, y_txt, mean=None):
    global color_discrete_map
    fig = px.line(df,
                  x=x,
                  y=y,
                  color=color,
                  markers=True,
                  color_discrete_map=color_discrete_map[color_map])
    
    add_total_line(fig=fig,
                   df=df,
                   x=x,
                   y=y)
    
    update_traces_lines(fig=fig,
                        y_txt=y_txt)

    update_layout(fig=fig, 
                  title=title,
                  x_title=x_title,
                  y_title=y_title)
    
    if(mean):
        include_mean(fig=fig,
                     df=df,
                     x=x,
                     y=y)
    return fig

def bar_chart(df, x, y, title, x_title, y_title, color, y_txt, mean=None):
    global color_discrete_map
    
    fig = px.bar(df,
                 x=x,
                 y=y,
                 color=color,
                 color_discrete_map=color_discrete_map)
    
    update_layout(fig=fig,
                  title=title,
                  x_title=x_title,
                  y_title=y_title)

    update_traces_bar(fig=fig,
                      y_txt=y_txt)
    
    if(mean):
        include_mean(fig=fig, 
                     df=df,
                     x=x, 
                     y=y)
    return fig