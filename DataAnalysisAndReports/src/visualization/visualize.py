import plotly.express as px
import plotly.graph_objects as go
from pandas import DataFrame
from plotly.graph_objects import Figure

# AJUSTAR VALOR DE 'x'
# fig.add_annotation(
# x_ref = 'x', y_ref = 'y',
# x = -0.5, y = mean,
# text = f'{mean:.2f}',
# show_arrow = False,
# font = dict(color = 'red'))

color_discrete_map = {
    'triage_color_map': {'Nivel I': '#BDBEBE',
                         'Nivel II': '#FA8162',
                         'Nivel III': '#CCCC52',
                         'Nivel IV': '#A0C791'},
    'isolated_discrete_map': {'Si': '#67A353',
                              'No': '#BA2E0F'},
    'status_discrete_map': {'Alta': '#C33D69',
                            'En observación': '#2EA597',
                            'En espera de internación': '#8456CE',
                            'Internado': '#E07941',
                            'Afuera': "#962249"},
    'age_range_discrete_map': {'0 a 40': '#E07941',
                               '41 a 60': '#C33D69',
                               '61 a 80': '#2EA597',
                               '+80': '#8456CE'}
}


def include_mean(fig: Figure, df: DataFrame, x: str, y: str, y_txt: str) -> None:
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    mean = df_sum[y].mean()
    fig.add_trace(go.Scatter(x=df_sum[x],
                             y=[mean] * len(df_sum),
                             mode='lines',
                             name='Media (Total)',
                             line=dict(color='red', width=2, dash='dash'),
                             hovertemplate='<b>%{y:.2f} ' + y_txt + ' </b>'))


def update_layout(fig: Figure, title: str, legend_title: str, x_title: str, y_title: str) -> None:
    fig.update_layout(title='<b> ' + title + ' </b>',
                      title_x=0.5,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True, gridcolor='rgb(200, 200, 200)'),
                      yaxis=dict(linecolor='black', showgrid=True, gridcolor='rgb(200, 200, 200)'),
                      legend=dict(title=legend_title))


def update_traces_lines(fig: Figure, y_txt: str) -> None:
    fig.update_layout(hovermode='x unified')
    fig.update_traces(mode='markers+lines',
                      hovertemplate='<b>%{y} ' + y_txt)


def update_traces_bar(fig: Figure, y_txt: str) -> None:
    fig.update_layout(hovermode='x unified')
    fig.update_traces(hovertemplate='<b>%{y} ' + y_txt + ' <b>')


def add_total_line(fig: Figure, df: DataFrame, x: str, y: str):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig.add_trace(go.Scatter(x=df_sum[x],
                             y=df_sum[y],
                             line=dict(color='#3B82F6'),
                             mode='lines',
                             name='Total'))


def line_chart(df: DataFrame, x: str, y: str, title: str, legend_title: str, x_title: str, y_title: str, color: str,
               color_map: str, y_txt: str, mean: bool = False) -> Figure:
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
                  legend_title=legend_title,
                  x_title=x_title,
                  y_title=y_title)

    if mean:
        include_mean(fig=fig,
                     df=df,
                     x=x,
                     y=y,
                     y_txt=y_txt)
    return fig


def bar_chart(df: DataFrame, x: str, y: str, title: str, legend_title: str, x_title: str, y_title: str, color: str,
              color_map: str, y_txt: str, mean=None):
    global color_discrete_map

    fig = px.bar(df,
                 x=x,
                 y=y,
                 color=color,
                 color_discrete_map=color_discrete_map[color_map])

    update_layout(fig=fig,
                  title=title,
                  legend_title=legend_title,
                  x_title=x_title,
                  y_title=y_title)

    update_traces_bar(fig=fig,
                      y_txt=y_txt)

    if mean:
        include_mean(fig=fig,
                     df=df,
                     x=x,
                     y=y,
                     y_txt=y_txt)
    return fig
