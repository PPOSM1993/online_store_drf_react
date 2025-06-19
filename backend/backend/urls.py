
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/customers/', include('apps.customers.urls')),
    path('api/category/', include('apps.category.urls')),
    path('api/books/', include('apps.books.urls')),  # Asegúrate de que el path sea este
    path('api/suppliers/', include('apps.suppliers.urls')),
    path('api/worker/', include('apps.worker.urls')),
    path('api/permissions/', include('apps.permissions.urls')),
    path('api/orders/', include('apps.orders.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)