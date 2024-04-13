import plotly.express as px
import plotly.graph_objects as go

# AJUSTAR VALOR DE 'x'
# fig.add_annotation(
# xref = 'x', yref = 'y',
# x = -0.5, y = mean,
# text = f'{mean:.2f}',
# showarrow = False,
# font = dict(color = 'red'))

color_discrete_map = {'Nivel I': '#BDBEBE', 
                      'Nivel II': '#FA8162', 
                      'Nivel III': '#CCCC52', 
                      'Nivel IV': '#A0C791'}

def include_mean(fig, df, x, y):
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
    fig.update_traces(hovertemplate='<b>%{y}' + f' {y_txt}<b>')  
    
def add_total_line(fig, df, x, y):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig.add_trace(go.Scatter(x=df_sum[x], 
                             y=df_sum[y], 
                             line=dict(color='#3B82F6'), 
                             mode='lines', 
                             name='Total'))
    

def line_chart(df, x, y, title, x_title, y_title, color, y_txt, mean=None):
    global color_discrete_map
    fig = px.line(df,
                  x=x,
                  y=y,
                  color=color,
                  markers=True,
                  color_discrete_map=color_discrete_map)
    
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