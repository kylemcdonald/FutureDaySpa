mogrify \
	-background none \
	-extent $1x$2 \
	-page +$3+$4 \
	-flatten \
	"$7"
lpr \
	-o fit-to-page \
	-o page-top=0 \
	-o page-right=0 \
	-o page-bottom=0 \
	-o page-left=0 \
	-o PageSize=Custom.$5x$6in \
	-o media=Custom.$5x$6in \
	"$7"