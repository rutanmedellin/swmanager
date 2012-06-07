import re

def mobile(request):

	device = {}

	ua = request.META.get('HTTP_USER_AGENT', '').lower()
	
	if ua.find("iphone") > 0:
		device['iphone'] = "iphone" + re.search("iphone os (\d)", ua).groups(0)[0]
		
	if ua.find("ipad") > 0:
		device['ipad'] = "ipad"
		
	if ua.find("android") > 0:
		device['android'] = "android" + re.search("android (\d\.\d)", ua).groups(0)[0].translate(None, '.')
		
	if ua.find("blackberry") > 0:
		device['blackberry'] = "blackberry"
		
	if ua.find("windows phone os 7") > 0:
		device['winphone7'] = "winphone7"
		
	if ua.find("iemobile") > 0:
		device['winmo'] = "winmo"
		
	if not device:			# either desktop, or something we don't care about.
		device['baseline'] = "baseline"
	
	# spits out device names for CSS targeting, to be applied to <html> or <body>.
	device['classes'] = " ".join(v for (k,v) in device.items())
	
	return {'device': device }
