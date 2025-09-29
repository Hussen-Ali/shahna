from django.shortcuts import render
from datetime import datetime, timedelta

def index(request):
    # Coming soon date — 10 days from now (adjust as you like)
    launch = datetime.utcnow() + timedelta(days=10)
    return render(request, "landing/index.html", {"launch_iso": launch.isoformat() + "Z"})
