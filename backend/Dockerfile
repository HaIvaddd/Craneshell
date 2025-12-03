FROM python:3.11-slim

WORKDIR /app

# Установи зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируй приложение
COPY . .

# Expose порт
EXPOSE 8000

# Запусти приложение
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
