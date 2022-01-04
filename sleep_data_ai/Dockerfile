FROM ubuntu:20.04

RUN apt-get update -y && \
    apt-get dist-upgrade -y && \
    apt-get install -y python3-pip python-dev

COPY ./requirements.txt /app/requirements.txt

COPY ./classifiers/rf_one.joblib  /app/classifiers/rf_one.joblib

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 5000

ENTRYPOINT [ "python3" ]

CMD [ "datahandler.py" ]