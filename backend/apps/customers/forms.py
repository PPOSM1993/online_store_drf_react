# forms.py
from django import forms
from .models import Customers, Region, City

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customers
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Solo muestra ciudades si ya hay una región seleccionada
        if 'region' in self.data:
            try:
                region_id = int(self.data.get('region'))
                self.fields['city'].queryset = City.objects.filter(region_id=region_id).order_by('name')
            except (ValueError, TypeError):
                self.fields['city'].queryset = City.objects.none()
        elif self.instance.pk:
            self.fields['city'].queryset = self.instance.region.cities.order_by('name')
        else:
            self.fields['city'].queryset = City.objects.none()