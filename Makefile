VENV :=  venv

backend:
	cd backend
activate:
	source $(VENV)/bin/activate

run:
	cd backend && python manage.py runserver
