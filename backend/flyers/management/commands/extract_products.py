# flyers/management/commands/extract_products.py

from django.core.management.base import BaseCommand
from flyers.models import Flyer
from flyers.pdf_processor import process_flyer_pdf

class Command(BaseCommand):
    help = 'Extract product images, names, and prices from a flyer PDF'

    def add_arguments(self, parser):
        parser.add_argument('flyer_id', type=int)

    def handle(self, *args, **kwargs):
        flyer_id = kwargs['flyer_id']
        flyer = Flyer.objects.get(id=flyer_id)
        flyer_path = flyer.pdf.path

        # Optional: Add your local poppler path here if needed
        poppler_path = r'C:\Users\maiya\Downloads\Release-24.08.0-0 (1)\poppler-24.08.0\Library\bin'

        self.stdout.write(f"Processing flyer: {flyer.title}")
        process_flyer_pdf(flyer_path, flyer, poppler_path)
        self.stdout.write(self.style.SUCCESS("✅ Extraction complete."))
