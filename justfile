dev:
	ls scss/* | entr -sr 'grass $0 css/$(basename $0 .scss).min.css -s compressed'

