FROM python:3.12-slim-bullseye as base

ENV DOCKER_CONTENT_TRUST=1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV PATH="/opt/venv/bin:$PATH"

FROM base as build

WORKDIR /app

RUN python -m venv /opt/venv

COPY pyproject.toml .
RUN /opt/venv/bin/pip install .


FROM base as app

WORKDIR /app

COPY . .
COPY --from=build /opt/venv /opt/venv

ENTRYPOINT ["/app/Docker/entrypoint.sh"]