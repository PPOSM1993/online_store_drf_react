
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/customers/', include('apps.customers.urls')),
    path('api/category/', include('apps.category.urls')),
    path('api/books/', include('apps.books.urls')),  # Asegúrate de que el path sea este
    

]