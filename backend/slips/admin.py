from django import forms
from django.contrib import admin
from .models import Slip
from .firebase_utils import fetch_firebase_users
from .utils import upload_slip_to_pinata  # Adjust to match your function name

class SlipAdminForm(forms.ModelForm):
    class Meta:
        model = Slip
        fields = ['product_name', 'temp_file', 'user_uid', 'warranty_start_date', 'warranty_end_date']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            firebase_users = fetch_firebase_users()
            self.fields['user_uid'] = forms.ChoiceField(
                choices=[(user['uid'], user['email']) for user in firebase_users] if firebase_users else []
            )
        except Exception as e:
            self.fields['user_uid'] = forms.ChoiceField(choices=[])
            print(f"Error fetching Firebase users: {e}")

    def clean(self):
        cleaned_data = super().clean()

        # Validate temp_file and handle IPFS hash generation
        if 'temp_file' in cleaned_data:
            try:
                file = cleaned_data['temp_file']
                file_content = file.read()
                ipfs_hash = upload_slip_to_pinata(file_content)  # Replace with actual function
                
                # Check if file already exists on IPFS
                if Slip.objects.filter(ipfs_hash=ipfs_hash).exists():
                    raise forms.ValidationError("This file has already been uploaded.")

                self.instance.ipfs_hash = ipfs_hash
                file.seek(0)  # Reset file pointer
            except Exception as e:
                raise forms.ValidationError(f"Upload failed: {str(e)}")

        return cleaned_data

class SlipAdmin(admin.ModelAdmin):
    form = SlipAdminForm
    list_display = ('product_name', 'ipfs_hash', 'user_uid', 'warranty_start_date', 'warranty_end_date')
    readonly_fields = ('ipfs_hash',)  # Make ipfs_hash non-editable

admin.site.register(Slip, SlipAdmin)
