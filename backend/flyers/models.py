from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)

    def _str_(self):
        return self.name

class Region(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def _str_(self):
        return f"{self.name}, {self.country.name}"
    
class Store(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='store_logos/', blank=True, null=True)
    provider = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='provider_stores', null=True, blank=True)


    def _str_(self):
        return self.name

class Flyer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to='flyers/pdfs/', blank=True, null=True)
    image = models.ImageField(upload_to='flyers/images/', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    expires_at = models.DateField()

    def _str_(self):
        return f"{self.title} - {self.region.name}"

class Product(models.Model):
    flyer = models.ForeignKey(Flyer, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)

    def _str_(self):
        return self.name



from django.db import models

class ProviderApplication(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]


    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    company_name = models.CharField(max_length=100)
    address = models.TextField()
    gst_number = models.CharField(max_length=50, blank=True)
    document = models.FileField(upload_to="provider_docs/")
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed = models.BooleanField(default=False)
    
    

    def _str_(self):
        return f"{self.full_name} ({self.company_name})"
    

class PendingFlyer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to='pending_flyers/pdfs/', blank=True, null=True)
    image = models.ImageField(upload_to='pending_flyers/images/', blank=True, null=True)
    expires_at = models.DateField()
    created_at = models.DateField(auto_now_add=True)

    def _str_(self):
        return f"{self.title} - Pending"