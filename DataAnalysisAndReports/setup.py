from setuptools import setup

setup(
    name='triage_hf',
    version='1.0.0',
    description='analysis dependencies',
    author='just-juanma',
    author_email='juanmanuelgonzalezkapnik@gmail.com',
    url='https://github.com/Adriellevy/Triage_HF',
    packages=['triage_hf'],
    install_requires=[
        'numpy',
        'pandas',
        'plotly',
    ],
)