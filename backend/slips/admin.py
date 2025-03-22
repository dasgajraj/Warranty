from django import forms
from django.contrib import admin
from .models import Slip
from .firebase_utils import fetch_firebase_users
from .utils import upload_slip_to_pinata  # Adjust to match your function name

class SlipAdminForm(forms.ModelForm):
    # imei_number = forms.CharField(max_length=50, required=True)

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

        file = cleaned_data.get('temp_file')
        warranty_end_date = cleaned_data.get('warranty_end_date')  # Correct variable name
        imei = cleaned_data.get('imei')  # Get IMEI from the form

        if not warranty_end_date or not imei:
            raise forms.ValidationError("Missing warranty end date or IMEI.")

        # ✅ Convert warranty_end_date to string in YYYY-MM-DD format
        warranty_end_date_str = warranty_end_date.strftime('%Y-%m-%d')

        if file:
            try:
                file_content = file.read()
                ipfs_hash = upload_slip_to_pinata(file_content, warranty_end_date_str, imei)

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
