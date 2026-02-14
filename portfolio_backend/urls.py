from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Add this line
from django.conf.urls.static import static # Add this line

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
]

# This is the ONLY way Django serves CSS/JS during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])