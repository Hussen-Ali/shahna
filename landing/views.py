from django.shortcuts import render
from datetime import datetime, timedelta

def index(request):
    # Fixed launch date (30 days from project start, e.g. Oct 29, 2025)
    launch = datetime(2025, 10, 29, 0, 0, 0)  # year, month, day, hour, min, sec
    return render(request, "landing/index.html", {"launch_iso": launch.isoformat() + "Z"})
