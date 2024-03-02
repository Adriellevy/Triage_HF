import plotly.graph_objects as go
import ipywidgets as widgets

out = widgets.Output()

@out.capture()
def handle_bar_click(trace, points, selector):
    print("Successfully selected")