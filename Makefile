VENV :=  venv

activate:
	cd backend && source $(VENV)/bin/activate

run:
	cd backend && python manage.py runserver
