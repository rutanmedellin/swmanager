from tastypie.fields import ApiField


# From https://github.com/andresdouglas/django-tastypie-nonrel/blob/master/tastypie_nonrel/fields.py
class ListField(ApiField):
    """
        Represents a list of simple items - strings, ints, bools, etc. For
        embedding objects use EmbeddedListField in combination with EmbeddedModelField
        instead.
    """
    dehydrated_type     =   'list'

    def dehydrate(self, obj):
        return self.convert(super(ListField, self).dehydrate(obj))

    def convert(self, value):
        if value is None:
            return None
        return value 
