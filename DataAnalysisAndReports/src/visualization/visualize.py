import plotly.express as px
import plotly.graph_objects as go

# AJUSTAR VALOR DE 'x'
# fig.add_annotation(
# xref = 'x', yref = 'y',
# x = -0.5, y = mean,
# text = f'{mean:.2f}',
# showarrow = False,
# font = dict(color = 'red'))


def bar_chart(df, x, y, title, x_title, y_title, color, mean=None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)

    fig = px.bar(df,
                 x=x,
                 y=y,
                 color=color,
                 color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#CCCC52', '4': '#A0C791'})

    fig.update_layout(title=title,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      title_x=0.5,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True),
                      yaxis=dict(linecolor='black', showgrid=True),
                      legend=dict(title='Nivel de Triage'))
    if (mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x=df_sum[x],
                                 y=[mean] * len(df_sum),
                                 mode='lines',
                                 name='Mean',
                                 line=dict(color='red', width=2, dash='dash'),
                                 hovertemplate='%{y:.2f}'))
    return fig


def line_chart(df, x, y, title, x_title, y_title, color, mean=None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig = px.line(df,
                  x=x,
                  y=y,
                  color=color,
                  markers=True,
                  color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#CCCC52', '4': '#A0C791'})
    fig.update_layout(title=title,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      title_x=0.5,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True),
                      yaxis=dict(linecolor='black', showgrid=True),
                      legend=dict(title='Nivel de Triage'))
    if (mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x=df_sum[x],
                                 y=[mean] * len(df_sum),
                                 mode='lines',
                                 name='Mean',
                                 line=dict(color='red', width=2, dash='dash'),
                                 hovertemplate='%{y:.2f}'))
    return fig
