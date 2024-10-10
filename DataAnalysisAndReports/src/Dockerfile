# specify start image
FROM python:3.12.7-slim

# all commands start from this directory
WORKDIR /DataAnalysis

# copy all files from this folder to working directory (ignores files in .dockerignore)
COPY . .

COPY requirements.txt requirements.txt

# Install Python dependencies
RUN pip3 install -r requirements.txt

# set the start command
CMD [ "python3", "app.py" ]
