from django.db import models
from django.utils.text import slugify


# ---------------- COUNTRY ---------------- #
class Country(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:255]
        super().save(*args, **kwargs)


# ---------------- REGION ---------------- #
class Region(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.country.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.country.name}")[:255]
        super().save(*args, **kwargs)


# ---------------- STORE ---------------- #
class Store(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='store_logos/', blank=True, null=True)
    provider = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='provider_stores', null=True, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:255]
        super().save(*args, **kwargs)


# ---------------- FLYER ---------------- #
class Flyer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to='flyers/pdfs/', blank=True, null=True)
    image = models.ImageField(upload_to='flyers/images/', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    expires_at = models.DateField()
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.region.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.region.name}")[:255]
        super().save(*args, **kwargs)


# ---------------- PRODUCT ---------------- #
class Product(models.Model):
    flyer = models.ForeignKey(Flyer, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.flyer.title}")[:255]
        super().save(*args, **kwargs)


# ---------------- PROVIDER APPLICATION ---------------- #
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
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} ({self.company_name})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.full_name}-{self.company_name}")[:255]
        super().save(*args, **kwargs)


# ---------------- PENDING FLYER ---------------- #
class PendingFlyer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to='pending_flyers/pdfs/', blank=True, null=True)
    image = models.ImageField(upload_to='pending_flyers/images/', blank=True, null=True)
    expires_at = models.DateField()
    created_at = models.DateField(auto_now_add=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.title} - Pending"

    def save(self, *args, **kwargs):
        if not self.slug:
            store_name = self.store.name if self.store else "unknown"
            self.slug = slugify(f"{self.title}-{store_name}")[:255]
        super().save(*args, **kwargs)
